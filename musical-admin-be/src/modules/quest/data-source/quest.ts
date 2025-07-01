import _ from 'lodash'
import DataLoader from 'dataloader'
import { UserInputError } from 'apollo-server-errors'
import { App, Logger } from '@core/globals'
import { MongoDataSource } from 'apollo-datasource-mongodb'
import ProjectionField from '@helpers/projection-field'
import Pagination from '@helpers/pagination'
import QueryResolver from '@helpers/query-resolver'
import { create, update, details } from '@helpers/mongoose'
import { GamificationDoc } from '@models/gamificationEvent'
import moment from 'moment'
import { QuestDoc } from '@models/quest'

export interface GraphQLInput {
	first?: number
	last?: number
	after?: string
	before?: string
	orderBy: string
	filters?: any
}

export interface PageResponse {
	edges?: Edge[]
	pageInfo?: PageInfo
}

export interface PageInfo {
	startCursor: string | null
	endCursor: string | null
	hasNextPage: boolean
	hasPreviousPage: boolean
}

export interface Edge {
	cursor: string | null
	node: any
}

export interface Keys {
	id: string
	projection: string
}

export interface periodInterface {
	yearly: {
		indicator: 'month' | 'day' | 'hour'
		index: number
	}
	monthly: {
		indicator: 'month' | 'day' | 'hour'
		index: number
	}
	weekly: {
		indicator: 'month' | 'day' | 'hour'
		index: number
	}
	daily: {
		indicator: 'month' | 'day' | 'hour'
		index: number
	}
}
export interface graphDataPayloadInterface {
	interval: 'yearly' | 'monthly' | 'weekly' | 'daily'
}
export default class QuestDataSource extends MongoDataSource<QuestDoc> {
	public Quest: any
	public questLoader: any
	private questPagination: any
	constructor(Quest) {
		super(Quest)
		this.questPagination = new Pagination(Quest)
	}

	public async checkIdentifier(identifier: string,) {
		Logger.info('Inside checkIdentifier Datasource Service')
		try {
			return details(this.model, { identifier: identifier })
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}

	public async create(payload: any): Promise<GamificationDoc> {
		Logger.info('Inside create Datasource Service')
		try {
			return create(this.model, payload)
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}

	public async getGamificationList({ after, before, first, last, orderBy, filters }: GraphQLInput, info: any) {
		Logger.info('Inside getGamificationList Datasource Service')
		try {
			const sort = QueryResolver.GetSortObj(orderBy)
			let filter = {}
			if (filters && Object.keys(filters).length > 0) filter = QueryResolver.GetFilterObj(filters)

			const queryArgs = _.pickBy({ after, before, first, last, filter, sort }, _.identity)

			const projection = await ProjectionField.ParseProjectionField(info, this.model.schema.obj)

			const edges: Edge[] = await this.questPagination.GetEdges(queryArgs, projection)

			const pageInfo: PageInfo | any = await this.questPagination.GetPageInfo(edges, queryArgs)

			return { edges, pageInfo }
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}

	private _gamificationByIdLoader = new DataLoader(async (keys: Keys[]) => {
		Logger.info('Inside _gamificationByIdLoader')
		try {
			const ids = [...new Set(keys.map((key) => key.id))]
			const roles = await this.model
				.find({ _id: { $in: ids } })
				.select(keys[0].projection)
				.exec()

			return keys.map((key) => {
				return roles.find((role) => role._id.toString() === key.id.toString())
			})
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	})

	public async getGamificationById(id: string, info: any) {
		Logger.info('Inside getGamificationById Datasource Service')
		try {
			if (id) {
				const projection = await ProjectionField.ParseProjectionField(info, this.model.schema.obj)

				return this._gamificationByIdLoader.load({ id, projection })
			}
			return null
		} catch (err) {
			Logger.error(`${err}`)
			throw new UserInputError(`${err.message}`)
		}
	}

	public async update(id: string, data: any) {
		Logger.info('Inside update Datasource Service')
		try {
			return update(this.model, { _id: id }, data)
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}

	public async getGamificationGraphOnDashboard({ interval }: graphDataPayloadInterface) {
		Logger.info('Inside getGamificationGraphOnDashboard Datasource Service');
		try {
			const periods: periodInterface = {
				yearly: { indicator: 'month', index: 12 },
				monthly: { indicator: 'day', index: 31 },
				weekly: { indicator: 'day', index: 7 },
				daily: { indicator: 'hour', index: 24 },
			};

			const chainObject = [];
			const arrMonth = [];

			Logger.info(`Interval selected: ${interval}`);
			Logger.info(`Period details: Indicator - ${periods[interval].indicator}, Index - ${periods[interval].index}`);

			for (let index = 1; index <= periods[interval].index; index++) {
				const startDate = moment()
					.startOf(periods[interval].indicator)
					.subtract(index - 1, periods[interval].indicator)
					.toDate();

				const endDate = moment()
					.endOf(periods[interval].indicator)
					.subtract(index - 1, periods[interval].indicator)
					.toDate();

				Logger.info(`Period ${index}: Start Date = ${startDate}, End Date = ${endDate}`);

				// Aggregating data within each period
				const depositsResult = await App.Models.EventTransaction.aggregate([
					{
						$match: {
							createdAt: {
								$gte: startDate,
								$lte: endDate,
							},
						},
					},
					{
						$group: {
							_id: null,
							totalAmount: { $sum: '$points' },
						},
					},
				]);

				const depositData = depositsResult.length > 0
					? depositsResult[0]
					: { totalAmount: 0 };

				const objParams = {
					value: depositData.totalAmount,
					datetime: moment()
						.startOf(periods[interval].indicator)
						.subtract(index - 1, periods[interval].indicator)
						.format('YYYY-DD-MMM'),
				};

				arrMonth[`data${index}`] = objParams;
			}

			const data = { arrMonth };
			chainObject.push(data);
			Logger.info('Successfully completed data processing for getTransactionGraphOnDashboard.');
			return chainObject;

		} catch (err) {
			Logger.error(`Error in getTransactionGraphOnDashboard: ${err.message}`);
			throw new UserInputError(`${err.message}`);
		}
	}
}
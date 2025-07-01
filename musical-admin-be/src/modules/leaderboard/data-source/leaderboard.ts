import _ from 'lodash'
import { UserInputError } from 'apollo-server-errors'
import { Logger } from '@core/globals'
import { MongoDataSource } from 'apollo-datasource-mongodb'
import ProjectionField from '@helpers/projection-field'
import Pagination from '@helpers/pagination'
import QueryResolver from '@helpers/query-resolver'
import { UserActivityDoc } from '@models/userActivity'
import { LeaderboardDoc } from '@models/leaderboard'

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

export default class LeaderboardDataSource extends MongoDataSource<LeaderboardDoc> {
	public Leaderboard: any
	public leaderboardLoader: any
	private leaderboardPagination: any
	constructor(Leaderboard) {
		super(Leaderboard)
		this.leaderboardPagination = new Pagination(Leaderboard)
	}


	public async getLeaderboardList({ after, before, first, last, orderBy, filters }: GraphQLInput, info: any) {
		Logger.info('Inside getLeaderboardList Datasource Service')
		try {
			const sort = QueryResolver.GetSortObj(orderBy)
			let filter = {}
			if (filters && Object.keys(filters).length > 0) filter = QueryResolver.GetFilterObj(filters)

			const queryArgs = _.pickBy({ after, before, first, last, filter, sort }, _.identity)

			const projection = await ProjectionField.ParseProjectionField(info, this.model.schema.obj)

			const edges: Edge[] = await this.leaderboardPagination.GetEdges(queryArgs, projection)

			const pageInfo: PageInfo | any = await this.leaderboardPagination.GetPageInfo(edges, queryArgs)

			return { edges, pageInfo }
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}

}
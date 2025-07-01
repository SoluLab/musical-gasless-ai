import _ from 'lodash'
import moment from 'moment'
import { UserInputError } from 'apollo-server-errors'
import { MongoDataSource } from 'apollo-datasource-mongodb'
import { Logger } from '@core/globals'
import Pagination from '@helpers/pagination'
import { TransactionDoc } from '@models/transaction'

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

export default class TransactionDataSource extends MongoDataSource<TransactionDoc> {
    private transactionPagination: any
    constructor(Transaction) {
        super(Transaction)
        this.transactionPagination = new Pagination(Transaction)
    }

    public async getTransactionGraphOnDashboard({ interval }: graphDataPayloadInterface) {
        Logger.info('Inside getTransactionGraphOnDashboard Datasource Service');
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

            // for (let index = 1; index <= periods[interval].index; index++) {
            //     const startDate = moment()
            //         .startOf(periods[interval].indicator)
            //         .subtract(index - 1, periods[interval].indicator)
            //         .toDate();

            //     const endDate = moment()
            //         .endOf(periods[interval].indicator)
            //         .subtract(index - 1, periods[interval].indicator)
            //         .toDate();

            //     Logger.info(`Period ${index}: Start Date = ${startDate}, End Date = ${endDate}`);

            //     // Aggregating data within each period
            //     const depositsResult = await this.model.aggregate([
            //         {
            //             $match: {
            //                 createdAt: {
            //                     $gte: startDate,
            //                     $lte: endDate,
            //                 },
            //             },
            //         },
            //         {
            //             $group: {
            //                 _id: null,
            //                 totalAmount: { $sum: '$amount' },
            //             },
            //         },
            //     ]);

            //     const depositData = depositsResult.length > 0
            //         ? depositsResult[0]
            //         : { totalAmount: 0 };

            //     const objParams = {
            //         value: depositData.totalAmount,
            //         datetime: moment()
            //             .startOf(periods[interval].indicator)
            //             .subtract(index - 1, periods[interval].indicator)
            //             .format('YYYY-DD-MMM HH:mm:ss')
            //         // .format('YYYY-DD-MMM'),

            //     };

            //     arrMonth[`data${index}`] = objParams;
            // }

            const oldest = moment().startOf(periods[interval].indicator).subtract(periods[interval].index - 1, periods[interval].indicator);
            for (let i = 0; i < periods[interval].index; i++) {
                const startDate = oldest.clone().add(i, periods[interval].indicator).toDate();
                const endDate = oldest.clone().add(i, periods[interval].indicator).endOf(periods[interval].indicator).toDate();

                const depositsResult = await this.model.aggregate([
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
                            totalAmount: { $sum: '$amount' },
                        },
                    },
                ]);

                const depositData = depositsResult.length > 0
                    ? depositsResult[0]
                    : { totalAmount: 0 };

                const objParams = {
                    value: depositData.totalAmount,
                    datetime: moment(startDate).format('YYYY-DD-MMM HH:mm:ss'),
                };

                arrMonth[`data${i + 1}`] = objParams;
            }
            const data = { arrMonth };
            chainObject.push(data);
            return chainObject;

        } catch (err) {
            Logger.error(`Error in getTransactionGraphOnDashboard: ${err.message}`);
            throw new UserInputError(`${err.message}`);
        }
    }
}
import { Logger } from '@core/logger'
import { UserInputError } from 'apollo-server-errors'

export const questList = {
	Query: {
		async questList(__: any, args: any, { dataSources: { Quest } }, info: any) {
			Logger.info('Inside questList Resolver')
			try {
				const questList = await Quest.getGamificationList(args, info)

				if (!questList) throw new Error('No questList found')

				return { edges: questList.edges, pageInfo: questList.pageInfo }
			} catch (err) {
				Logger.error(`${err}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	},
	Quest: {
		async createdById(parent: any, __: any, { dataSources: { Admin } }, info: any) {
			Logger.info('Inside createdById Resolver')
			try {
				return Admin.getUser(parent.createdById.toString())
			} catch (err) {
				Logger.error(`${err}`)
				throw new UserInputError(`${err.message}`)
			}
		},
		async updatedById(parent: any, __: any, { dataSources: { Admin } }, info: any) {
			Logger.info('Inside updatedById Resolver')
			try {
				return Admin.getUser(parent.updatedById.toString())
			} catch (err) {
				Logger.error(`${err}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	}
}

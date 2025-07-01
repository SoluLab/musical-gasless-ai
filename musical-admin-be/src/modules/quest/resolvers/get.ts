import { UserInputError } from 'apollo-server-errors'
import { Logger } from '@core/globals'
import { RoleDoc } from '@models/role'

interface Id {
	id: string
}

interface Context {
	dataSources: any
}

export const quest = {
	Query: {
		async quest(
			__: any,
			{ id }: Id,
			{ dataSources: { Quest } }: Context,
			info: any
		): Promise<any> {
			Logger.info('Inside quest Resolver')
			try {
				const quest = await Quest.getGamificationById(id, info)
				if (!quest) {
					throw new UserInputError('Event does not exist.')
				}
				return quest
			} catch (err) {
				Logger.error(`${err.message}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	}
}
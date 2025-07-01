import { Logger } from '@core/logger'
import { UserInputError } from 'apollo-server-errors'
import { Role } from '@core/constants/roles'

export const users = {
	Query: {
		async users(__: any, args: any, { dataSources: { User } }, info: any) {
			Logger.info('Inside users Resolver')

			try {
				args.filters = { ...args.filters, rolesMatch: Role.USER }

				if (args.filters.createdAtFrom && args.filters.createdAtTo && (args.filters.createdAtFrom === args.filters.createdAtTo)) {
					const date = new Date(args.filters.createdAtFrom);

					const startOfDay = new Date(date);
					startOfDay.setUTCHours(0, 0, 0, 0);

					const endOfDay = new Date(date);
					endOfDay.setUTCHours(23, 59, 59, 999);

					args.filters.createdAtFrom = startOfDay.toISOString();
					args.filters.createdAtTo = endOfDay.toISOString();
				}

				const users = await User.getUsers(args, info)

				if (!users) throw new Error('No users found')

				return { edges: users.edges, pageInfo: users.pageInfo }
			} catch (err) {
				Logger.error(`${err}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	},
}
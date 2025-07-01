import { Logger } from '@core/logger'
import { UserInputError } from 'apollo-server-errors'

export const leaderboard = {
	Query: {
		async leaderboard(__: any, args: any, { dataSources: { Leaderboard } }, info: any) {
			Logger.info('Inside leaderboard Resolver')
			try {

				const leaderboard = await Leaderboard.getLeaderboardList(args, info)
				if (!leaderboard) throw new Error('No leaderboard found')

				return { edges: leaderboard.edges, pageInfo: leaderboard.pageInfo }
			} catch (err) {
				Logger.error(`${err}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	},
	Leaderboard: {
		async userId(
			{ userId }: { userId: string },
			__: any,
			{ dataSources: { User } },
			info: any
		) {
			Logger.info('Inside userId Resolver')
			try {
				return User.getSingleUser({ _id: userId.toString() })
			} catch (err) {
				Logger.error(`${err.message}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	},
}

import { UserInputError } from 'apollo-server-errors'
import { Logger } from '@core/globals'
import { UserDoc } from '@models/user'

interface graphPayload {
    input: {
        interval: string
    }
}
interface Context {
    user: UserDoc
    dataSources: any
}

interface graphResponse {
    message: string
    status: string
    graphdata?: any
}

export const gamificationGraph = {
    Mutation: {
        async gamificationGraph(
            _: any,
            { input }: graphPayload,
            { dataSources: { Gamification }, user }: Context
        ): Promise<graphResponse> {
            Logger.info('Inside gamificationGraph Resolvers')
            try {
                if (!user)
                    return { message: 'Please check the token. User details does not exist', status: 'error' }

                const graphdata = await Gamification.getGamificationGraphOnDashboard(input)

                return {
                    graphdata,
                    message: 'graph data fetched successfully',
                    status: 'success',
                }
            } catch (err) {
                Logger.error(`${err.message}`)
                throw new UserInputError(`${err.message}`)
            }
        },
    },
}

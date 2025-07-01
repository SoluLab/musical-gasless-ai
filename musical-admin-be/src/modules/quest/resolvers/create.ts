import { UserInputError } from 'apollo-server-errors'
import { Logger } from '@core/globals'
import { AdminDoc } from '@models/admin'

interface CreateAdminPayload {
    input: {
        name: string
        identifier: string
        points: number
        description: string
        occurrence: number
        isPublishByAdmin: boolean
    }
}

interface Context {
    user: AdminDoc
    dataSources: any
}

interface createEventResponse {
    message: string
    status: string
}

export const create = {
    Mutation: {
        async createQuest(
            __: any,
            { input }: CreateAdminPayload,
            { dataSources: { Quest }, user }: Context,
        ): Promise<createEventResponse> {
            Logger.info('Inside createEvent Resolvers')
            try {
                if (!user)
                    return { message: 'Please check the token. User details does not exist', status: 'error' }

                const { name, identifier, points, occurrence, isPublishByAdmin, description } = input

                if (!name || !identifier || !points || !occurrence || !isPublishByAdmin) {
                    return { message: 'Please fill all the fields', status: 'error' }
                }

                const existingIdentifier = await Quest.checkIdentifier(identifier)
                if (existingIdentifier.length) {
                    return { message: 'Identifier already exists', status: 'error' }
                }

                const payload = {
                    name,
                    identifier,
                    points,
                    description,
                    occurrence,
                    isPublishByAdmin,
                    createdById: user._id,
                    updatedById: user._id
                }

                await Quest.create(payload)


                return { message: 'Quest created Successfully.', status: 'success' }
            } catch (err) {
                Logger.error(`${err.message}`)
                throw new UserInputError(`${err.message}`)
            }
        },
    },
}

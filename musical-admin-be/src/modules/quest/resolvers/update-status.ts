import _ from 'lodash'
import { UserInputError } from 'apollo-server-errors'
import { App, Logger } from '@core/globals'
import { UserDoc } from '@models/user'

interface UpdateStatusPayload {
    where: {
        id: typeof App.ObjectId
    }
    input: {
        isPublished: boolean
    }
}

interface Context {
    user: UserDoc
    dataSources: any
}

interface UpdateEventResponse {
    message: string
    status: string
}

export const questStatus = {
    Mutation: {
        async questStatus(
            __: any,
            { where, input }: UpdateStatusPayload,
            { dataSources: { Quest }, user }: Context,
        ): Promise<UpdateEventResponse> {
            Logger.info('Inside questStatus Resolver')
            try {
                const { id } = where
                const { isPublished } = input

                const data = {
                    isPublished
                }

                const updated = await Quest.update(id, data)

                if (!updated) return { message: 'Error updating quest status', status: 'error' }

                const message = isPublished ? "published" : "unpublished"

                return { status: 'success', message: `Quest ${message} Successfully.` }

            } catch (err) {
                Logger.error(`${err.message}`)
                throw new UserInputError(`${err.message}`)
            }
        },
    },
}
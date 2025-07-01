import _ from 'lodash'
import { UserInputError } from 'apollo-server-errors'
import { App, Logger } from '@core/globals'
import { UserDoc } from '@models/user'

interface UpdateEventPayload {
	where: {
		id: typeof App.ObjectId
	}
	input: {
		name: string
		description: string
		points: number
		occurrence: number
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

export const updateQuest = {
	Mutation: {
		async updateQuest(
			__: any,
			{ where, input }: UpdateEventPayload,
			{ dataSources: { Quest }, user }: Context,
		): Promise<UpdateEventResponse> {
			Logger.info('Inside updateQuest Resolver')
			try {
				if (!user)
					return { message: 'Please check the token. User details does not exist', status: 'error' }

				const { id } = where
				const { name, points, occurrence, description } = input

				const data = _.pickBy(
					{
						name, points, occurrence, description, updatedById: user._id
					},
					_.identity
				)

				const updated = await Quest.update(id, data)

				if (!updated) return { message: 'Error updating event', status: 'error' }


				return { status: 'success', message: `Quest updated Successfully.` }

			} catch (err) {
				Logger.error(`${err.message}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	},
}
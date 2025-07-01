import { gql } from 'apollo-server-express'

const questTypes = gql`

    type Mutation {
		"Creates a new quest with the specified details."
		createQuest(input: CreateQuestInput!): messageResponse!

		"Update Event data"
		updateQuest(where: QuestWhereUpdateInput!, input: QuestUpdateInput!): messageResponse!

		"Update Event status"
		questStatus(where: QuestWhereUpdateInput!, input: QuestStatusInput!): messageResponse!
	}

	type Query {
		"A list of quest event"
		questList(
			after: String
			before: String
			first: Int
			last: Int
			orderBy: QuestOrderByInput!
			filters: QuestWhereInput
		): QuestConnection!

		"A quest details"
		quest(id: String!): Quest!
	}

	input QuestWhereUpdateInput {
		id: ID!
	}

	input QuestStatusInput {
		isPublished:Boolean
	}

	input QuestUpdateInput {
		occurrence: Int
        points: Float
		description: String
        name: String
	}


	input CreateQuestInput {
        name: String
        identifier: String
		description: String
        points: Float
        occurrence: Int
		isPublishByAdmin:Boolean
		isPublished:Boolean
	}

	input QuestWhereInput {
		questSearch:String
		status:String
		isPublishByAdminMatch:Boolean
		isPublishMatch:Boolean
	}

	type Quest {
		id: ID!
        occurrence: Int
        points: Float
        identifier: String
		description: String
		isPublished:Boolean
        name: String
		isPublishByAdmin:Boolean
		isActive:Boolean
		createdById:Admin
		updatedById:Admin
	}

	type QuestEdge {
		"A cursor for use in pagination."
		cursor: ID!
		"A post at the end of an edge."
		node: Quest
	}

	type PageInfo {
		"The cursor to continue from when paginating forward."
		endCursor: ID
		"Whether there are more items when paginating forward."
		hasNextPage: Boolean!
		"Whether there are more items when paginating backward."
		hasPreviousPage: Boolean!
		"The cursor to continue from them paginating backward."
		startCursor: ID
	}

	type QuestConnection {
		"A list of post edges."
		edges: [QuestEdge]
		"Information to assist with pagination."
		pageInfo: PageInfo!
	}

	enum QuestOrderByInput {
		"Order role ascending by creation time."
		createdAt_ASC
		"Order role decending by creation time."
		createdAt_DESC
		"Order role ascending by name."
		name_ASC
		"Order role ascending by name."
		name_DESC
	}

	type messageResponse {
		"Response Message in string for success or failure."
		message: String!
		"Status of the response in boolean for success or failure."
		status: String!
	}

`

export default questTypes

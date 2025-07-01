
import { gql } from 'apollo-server-express'

const leaderboardTypes = gql`
	type Query {
		"A list of gamification event"
		leaderboard(
			after: String
			before: String
			first: Int
			last: Int
			orderBy: LeaderboardOrderByInput!
			filters: LeaderboardWhereInput
		): LeaderboardConnection
	}

	input LeaderboardWhereInput {
		leaderboardSearch:String
		status:String
		userId:ID
	}

	type Leaderboard {
		_id: ID!
		userId: User
		questPerformed:Float
		questPoints:Float
		eventPerformed:Float
		eventPoints:Float
		points:Float
	}

	type LeaderboardEdge {
		"A cursor for use in pagination."
		cursor: ID!
		"A post at the end of an edge."
		node: Leaderboard
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

	type LeaderboardConnection {
		edges: [LeaderboardEdge]
		pageInfo: PageInfo!
	}

	enum LeaderboardOrderByInput {
		createdAt_ASC
		createdAt_DESC
		name_ASC
		name_DESC
		points_DESC
		points_ASC
	}

`

export default leaderboardTypes

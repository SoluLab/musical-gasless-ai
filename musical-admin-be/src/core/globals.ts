import Config, { ConfigInterface } from '@config'
import { Logger } from './logger'
import { Schema } from 'mongoose'
import path from 'path'
import _ from 'lodash'
import { User } from '@models/user'
import { Role } from '@models/role'
import DataSources from '@datasources/index'
// malvtic
import { Admin } from '@models/admin'
import { Project } from '@models/project'
import { Activity } from '@models/activity'
import { Track } from '@models/track'
import { TrackProject } from '@models/trackProject'
import { Subscription } from '@models/subscription'
import { Distro } from '@models/distro'
import { Metadata } from '@models/metadata'
import { Transaction } from '@models/transaction'
import { UserSubscription } from '@models/usersubscription'
import { Gamification } from '@models/gamificationEvent'
import { UserActivity } from '@models/userActivity'
import { Nft } from '@models/nft'
import { EventTransaction } from '@models/eventTransaction'
import { Quest } from '@models/quest'
import { QuestHistory } from '@models/questHistory'
import { Leaderboard } from '@models/leaderboard'
import { UserStorage } from '@models/userStorage'
import { Notify } from '@models/notify'
const { ObjectId } = Schema.Types

const config: ConfigInterface = Config()

// models
const Models: {
	User: typeof User
	Role: typeof Role
	// malvtic
	Admin: typeof Admin
	Project: typeof Project
	Activity: typeof Activity
	Track: typeof Track
	TrackProject: typeof TrackProject
	Subscription: typeof Subscription
	Distro: typeof Distro
	Metadata: typeof Metadata
	Transaction: typeof Transaction
	UserSubscription: typeof UserSubscription
	Gamification: typeof Gamification
	UserActivity: typeof UserActivity
	Nft: typeof Nft
	EventTransaction: typeof EventTransaction
	Quest: typeof Quest
	QuestHistory: typeof QuestHistory
	Leaderboard: typeof Leaderboard
	UserStorage: typeof UserStorage
	Notify: typeof Notify
} = {
	User,
	Role,
	Admin,
	Project,
	Activity,
	Track,
	TrackProject,
	Subscription,
	Distro,
	Metadata,
	Transaction,
	UserSubscription,
	Gamification,
	UserActivity,
	Nft,
	EventTransaction,
	Quest,
	QuestHistory,
	Leaderboard,
	UserStorage,
	Notify
}

// Export Global Variables
export { Logger }
// TODO: Pass config.NODE_ENDPOINT to below instantiation.
export const App = {
	EXTENSION_ECOSYSTEM: path.extname(__filename) === '.js' ? 'js' : 'ts ',
	Http: {
		app: null,
	},
	Models,
	Config: config,
	Database: null,
	datasources: DataSources,
	ObjectId,
}

// Assign them to Global
export const Global: any = global
Global.Logger = Logger
Global.App = App
Global._ = _

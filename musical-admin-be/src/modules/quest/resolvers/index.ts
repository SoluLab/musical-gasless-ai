import _ from 'lodash'
import { questList } from './get-all'
import { quest } from './get'
import { updateQuest } from './update'
import { create } from './create'
import { questStatus } from './update-status'

export const questResolvers = _.merge(create, questList, quest, updateQuest, questStatus)

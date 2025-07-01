import _ from 'lodash'
import { dashboard } from './dashboard'
import { graph } from './graph'
import { userGraph } from './userGraph'
import { sellNftGraph } from './sellNftGraph'
import { gamificationGraph } from './gamificationGraph'

export const dashboardResolvers = _.merge(dashboard, graph, userGraph, sellNftGraph, gamificationGraph)

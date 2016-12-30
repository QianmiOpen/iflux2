//@flow

'use strict;'

import {Action, Actor} from 'iflux2'

import type {ActorState} from 'iflux2'

export default class FilterActor extends Actor {
  defaultState() {
    return {
      filterStatus: '' //默认没有过滤条件
    }
  }

  @Action('filter')
  changeFilter(state: ActorState, status: string) {
    return state.set('filterStatus', status)
  }

  @Action('init')
  init(state: ActorState, {filterStatus}: {filterStatus: string}) {
    return state.set('filterStatus', filterStatus)
  }
}

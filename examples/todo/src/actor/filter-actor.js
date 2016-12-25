//@flow
import {Action, Actor} from 'iflux2'
import type {Map} from 'immutable'

type State = Map<string, string>;

export default class FilterActor extends Actor {
  defaultState() {
    return {
      filterStatus: '' //默认没有过滤条件
    }
  }

  @Action('filter')
  changeFilter(state: State, status: string) {
    return state.set('filterStatus', status)
  }

  @Action('init')
  init(state: State, {filterStatus}: {filterStatus: string}) {
    return state.set('filterStatus', filterStatus)
  }
}

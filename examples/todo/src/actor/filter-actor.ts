import { Action, Actor, IMap } from 'iflux2'

export default class FilterActor extends Actor {
  defaultState() {
    return {
      filterStatus: '' //默认没有过滤条件
    }
  }

  @Action('filter')
  changeFilter(state: IMap, status: string) {
    return state.set('filterStatus', status)
  }

  @Action('init')
  init(state: IMap, filterStatus: string) {
    return state.set('filterStatus', filterStatus)
  }
}

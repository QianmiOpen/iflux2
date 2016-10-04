import {Action, Actor} from 'iflux2'


export default class FilterActor extends Actor {
  defaultState() {
    return {
      filterStatus: '' //默认没有过滤条件
    }
  }

  @Action('filter')
  changeFilter(state, status) {
    return state.set('filterStatus', status)
  }

  @Action('init')
  init(state, {filterStatus}) {
    return state.set('filterStatus', filterStatus)
  }
}

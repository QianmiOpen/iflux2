import { Action, Actor, IMap } from 'iflux2'

export default class ListActor extends Actor {
  defaultState() {
    return {
      blogs: []
    }
  }

  @Action('init')
  init(state: IMap, blogs: Array<Object>) {
    return state.set('blogs', blogs)
  }
}

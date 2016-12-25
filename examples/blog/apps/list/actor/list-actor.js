//@flow
import {Action, Actor} from 'iflux2'
import type {Map, List}  from 'immutable'

type State = Map<string, List<Object>>;

export default class ListActor extends Actor {
  defaultState() {
    return {
      blogs: []
    }
  }

  @Action('init')
  init(state: State, blogs: Array<Object>) {
    return state.set('blogs', blogs)
  }
}

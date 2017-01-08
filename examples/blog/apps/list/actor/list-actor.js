//@flow
import {Action, Actor} from 'iflux2'

import type {ActorState} from 'iflux2'

export default class ListActor extends Actor {
  defaultState() {
    return {
      blogs: []
    }
  }

  @Action('init')
  init(state: ActorState, blogs: Array<Object>) {
    return state.set('blogs', blogs)
  }
}

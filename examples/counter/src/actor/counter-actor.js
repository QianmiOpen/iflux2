//@flow

'use strict;'

import { Actor, Action } from 'iflux2'

import type {ActorState} from 'iflux2'

/**
 * CounterActor
 */
export default class CounterActor extends Actor {
  defaultState() {
    return {
      count: 0
    }
  }

  @Action('increment')
  increment(state: ActorState) {
    return state.update('count', count => count + 1)
  }

  @Action('decrement')
  decrement(state: ActorState) {
    return state.update('count', count => count - 1)
  }
}

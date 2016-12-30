//@flow

'use strict;'

import { Actor, Action } from 'iflux2'

import type {ActorState} from 'iflux2'

/**
 * TimerActor
 */
export default class CounterActor extends Actor {
  defaultState() {
    return {
      time: 0
    }
  }

  @Action('start')
  increment(state: ActorState) {
    return state.update('time', time => time + 1)
  }

  @Action('reset')
  reset(state: ActorState) {
    return state.set('time', 0)
  }
}

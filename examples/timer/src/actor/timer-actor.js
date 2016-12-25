//@flow
import { Actor, Action } from 'iflux2'
import type {Map} from 'immutable'

type State = Map<string, number>;

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
  increment(state: State) {
    return state.update('time', time => time + 1)
  }

  @Action('reset')
  reset(state: State) {
    return state.set('time', 0)
  }
}

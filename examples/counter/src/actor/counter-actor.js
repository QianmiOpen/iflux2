//@flow
import { Actor, Action } from 'iflux2'
import type { Map } from 'immutable'

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
  increment(state: Map<string, number>) {
    return state.update('count', count => count + 1)
  }

  @Action('decrement')
  decrement(state: Map<string, number>) {
    return state.update('count', count => count - 1)
  }
}

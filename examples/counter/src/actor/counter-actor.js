import { Actor, Action } from 'iflux2'

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
  increment(state) {
    return state.update('count', count => count + 1)
  }

  @Action('decrement')
  decrement(state) {
    return state.update('count', count => count - 1)
  }
}

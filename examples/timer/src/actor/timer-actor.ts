import { Actor, Action, IMap } from 'iflux2'

export default class CounterActor extends Actor {
  defaultState() {
    return {
      time: 0
    }
  }

  @Action('start')
  increment(state: IMap) {
    return state.update('time', time => time + 1)
  }

  @Action('reset')
  reset(state: IMap) {
    return state.set('time', 0)
  }
}

import { Actor, Action, IMap } from "iflux2";

export default class CounterActor extends Actor {
  defaultState() {
    return { count: 1 }
  }

  @Action('like')
  like(state: IMap) {
    return state.update('count', count => count + 1)
  }
}
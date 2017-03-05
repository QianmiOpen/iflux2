import { Actor, Action, IMap } from 'iflux2'

export default class HelloActor extends Actor {
  defaultState() {
    return { text: 'hello iflux2!' }
  }

  @Action('change')
  change(state: IMap, text) {
    return state.set('text', text)
  }
}
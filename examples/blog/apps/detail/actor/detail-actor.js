//@flow
import { Actor, Action }  from 'iflux2'
import type {Map} from 'immutable'

export default class DetailActor extends Actor {
  defaultState() {
    return {
      id: 0,
      title: '',
      content: '',
      createAt: ''
    }
  }

  @Action('init')
  init(state: Map<string, number|boolean>, blog: Object){
    return state.merge(blog)
  };
}

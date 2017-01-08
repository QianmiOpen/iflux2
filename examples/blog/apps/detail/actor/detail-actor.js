//@flow
import { Actor, Action }  from 'iflux2'

import type {ActorState} from 'iflux2'

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
  init(state: ActorState, blog: Object){
    return state.merge(blog)
  };
}

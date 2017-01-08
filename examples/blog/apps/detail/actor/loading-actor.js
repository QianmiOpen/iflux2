//@flow
import { Actor, Action }  from 'iflux2'
import type {ActorState} from 'iflux2'

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      loading: true
    }
  }

  @Action('loading')
  loading(state: ActorState, status: boolean) {
    return state.set('loading', status)
  }
}

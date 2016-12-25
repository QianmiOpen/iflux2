//@flow
import { Actor, Action }  from 'iflux2'
import type {Map} from 'immutable'

type State = Map<string, boolean>;

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      loading: true
    }
  }

  @Action('loading')
  loading(state: State, status: boolean) {
    return state.set('loading', status)
  }
}

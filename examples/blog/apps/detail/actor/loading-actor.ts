import { Actor, Action, IMap } from 'iflux2'

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      loading: true
    }
  }

  @Action('loading')
  loading(state: IMap, status: boolean) {
    return state.set('loading', status)
  }
}

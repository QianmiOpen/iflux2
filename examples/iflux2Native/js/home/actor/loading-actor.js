import { Actor, Action } from 'iflux2'

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      loading: true,
    }
  }

  @Action('loading:success')
  loadingSuccess(state) {
    return state.set('loading', false)
  }
}

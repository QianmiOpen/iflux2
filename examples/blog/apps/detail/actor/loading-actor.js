import { Actor, Action }  from 'iflux2'

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      loading: true
    }
  }

  @Action('loading')
  loading(state, status) {
    return state.set('loading', status)
  }
}

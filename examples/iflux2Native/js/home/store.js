import { Store } from 'iflux2'
import TextActor from './actor/text-actor'
import LoadingActor from './actor/loading-actor'

export default class AppStore extends Store {
  constructor(props) {
    super(props)
    //dev mode
    if (__DEV__) {
      window._store = this
    }
  }

  bindActor() {
    return [
      new TextActor,
      new LoadingActor
    ]
  }

  //;;;;;;;;;;;;;;action;;;;;;;;;;;;
  loadingSuccess = () => {
    this.dispatch('loading:success')
  };
}

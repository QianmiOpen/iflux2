//@flow
import { Store, IOptions } from 'iflux2'
import LoadingActor from './actor/loading-actor'
import DetailActor from './actor/detail-actor'
import { fetchDetail } from './webapi'

export default class AppStore extends Store {
  bindActor() {
    return [
      new LoadingActor,
      new DetailActor
    ]
  }

  constructor(props: IOptions) {
    super(props)
    if (__DEV__) {
      //debug
      window['store'] = this
    }
  }

  //;;;;;;;;;;;;;;;;;action;;;;;;;;;;;;;;;
  init = async (id: number) => {
    this.dispatch('loading', true)
    const blog = await fetchDetail(id)
    this.dispatch('init', blog)
    this.dispatch('loading', false)
  };
}

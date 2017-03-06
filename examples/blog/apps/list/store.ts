import { Store, IOptions } from 'iflux2'
import ListActor from './actor/list-actor'
import { fromJS } from 'immutable'

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props)
    if (__DEV__) {
      window['_store'] = this
    }
  }

  bindActor() {
    return [
      new ListActor
    ]
  }


  init = () => {
    const blogIds = JSON.parse(localStorage.getItem('blog@all') || '[]')
    const blogs = blogIds.map(v => JSON.parse(
      localStorage.getItem(`blog@${v}`) || ''
    ))
    this.dispatch('init', fromJS(blogs))
  };
}

//@flow
/**
 * appstore, state container
 */
import {Store} from 'iflux2'
import ListActor from './actor/list-actor'
import {fromJS} from 'immutable'
// import {fetchMsg} from './webapi'
import type {StoreOptions} from 'iflux2'

export default class AppStore extends Store {
  constructor(props: StoreOptions = {debug: false}) {
    super(props)
    if (__DEV__) {
      window.store = this
    }
  }

  bindActor() {
    return [
      new ListActor
    ]
  }


  //;;;;;;;;;;;;;;;action;;;;;;;;;;;;;;;
  init = () => {
    const blogIds = JSON.parse(localStorage.getItem('blog@all') || '[]')
    const blogs = blogIds.map(v => JSON.parse(
      localStorage.getItem(`blog@${v}`) || ''
    ))
    this.dispatch('init', fromJS(blogs))
  };
}

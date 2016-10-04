/**
 * appstore, state container
 */
import {Store} from 'iflux2'
import ListActor from './actor/list-actor'
import {fromJS} from 'immutable'
// import {fetchMsg} from './webapi'


export default class AppStore extends Store {
  constructor(props) {
    super(props)
    //debug
    window.store = this
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
      localStorage.getItem(`blog@${v}`)
    ))
    this.dispatch('init', fromJS(blogs))
  };
}

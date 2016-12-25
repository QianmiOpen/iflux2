//@flow
import { Store } from 'iflux2'
import BlogActor from './actor/blog-actor'
import type {Options} from '../types'


export default class AppStore extends Store  {
  bindActor() {
    return [
      new BlogActor
    ]
  }

  constructor(props: Options) {
    super(props)
    if (__DEV__) {
      window._store = this
    }
  }

  //;;;;;;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;
  changeTitle = (title: string) => {
    this.dispatch('changeTitle', title)
  };


  changeContent = (content: string) => {
    this.dispatch('changeContent', content)
  };


  submit = () => {
    this.dispatch('submit')
  }
}

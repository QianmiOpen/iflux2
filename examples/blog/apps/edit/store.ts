import { Store, IOptions } from 'iflux2'
import BlogActor from './actor/blog-actor'

export default class AppStore extends Store {
  bindActor() {
    return [
      new BlogActor
    ]
  }

  constructor(props: IOptions) {
    super(props)
    if (__DEV__) {
      window['_store'] = this
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

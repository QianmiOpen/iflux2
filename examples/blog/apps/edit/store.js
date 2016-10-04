import { Store } from 'iflux2'
import BlogActor from './actor/blog-actor'


export default class AppStore extends Store  {
  bindActor() {
    return [
      new BlogActor
    ]
  }

  //;;;;;;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;
  changeTitle = (title) => {
    this.dispatch('changeTitle', title)
  };


  changeContent = (content) => {
    this.dispatch('changeContent', content)
  };


  submit = () => {
    this.dispatch('submit')
  }
}

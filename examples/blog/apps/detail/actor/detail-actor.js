import { Actor, Action }  from 'iflux2'

export default class DetailActor extends Actor {
  defaultState() {
    return {
      id: 0,
      title: '',
      content: '',
      createAt: ''
    }
  }

  @Action('init')
  init(state, blog){
    return state.merge(blog)
  };
}

import { Actor, Action, IMap } from 'iflux2'

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
  init(state: IMap, blog: Object) {
    return state.merge(blog)
  };
}

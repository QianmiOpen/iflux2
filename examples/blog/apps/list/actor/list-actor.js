import {Action, Actor} from 'iflux2'


export default class ListActor extends Actor {
  defaultState() {
    return {
      blogs: []
    }
  }


  @Action('init')
  init(state, blogs) {
    return state.set('blogs', blogs)
  }
}

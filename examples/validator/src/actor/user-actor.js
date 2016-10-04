import { Actor, Action } from 'iflux2'
import { fromJS } from 'immutable'

const init = {
  username: '',
  password: '',
  confirm: '',
  email: '',
  qq: ''
};

export default class UserActor extends Actor {
  defaultState() {
    return init
  }

  @Action('changeValue')
  changeValue(state, {name, value}) {
    return state.set(name, value)
  }

  @Action('reset')
  reset(state) {
    return state.merge(fromJS(init))
  }
}

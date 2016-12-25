//@flow
import { Actor, Action } from 'iflux2'
import { fromJS } from 'immutable'
import type { Map } from 'immutable'

const init = {
  username: '',
  password: '',
  confirm: '',
  email: '',
  qq: ''
};

type State = Map<string, Object>;

export default class UserActor extends Actor {
  defaultState() {
    return init
  }

  @Action('changeValue')
  changeValue(state: State, {name, value}: {name: string, value: string}) {
    return state.set(name, value)
  }

  @Action('reset')
  reset(state: State) {
    return state.merge(fromJS(init))
  }
}

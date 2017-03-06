import { Actor, Action, IMap } from 'iflux2'
import { fromJS } from 'immutable'

type Field = { name: string; value: string; }

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
  changeValue(state: IMap, { name, value }: Field) {
    return state.set(name, value)
  }

  @Action('reset')
  reset(state: IMap) {
    return state.merge(fromJS(init))
  }
}

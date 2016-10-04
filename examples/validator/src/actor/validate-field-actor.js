import { Actor, Action } from 'iflux2'
import { OrderedSet, fromJS } from 'immutable'

export default class ValidateFieldActor extends Actor {
  defaultState() {
    return {
      fields: OrderedSet()
    }
  }

  @Action('validateField')
  validateField(state, field) {
    //全部校验
    if (field === 'all') {
      return state.update('fields', (fields) => fields.merge(fromJS([
        'username',
        'password',
        'confirm',
        'email',
        'qq'
      ])))
    }

    //动态的追加校验
    return state.update('fields', (fields) => {
      return fields.add(field)
    })
  }


  @Action('reset')
  reset(state) {
    return state.update('fields', (fields) => fields.clear());
  }
}

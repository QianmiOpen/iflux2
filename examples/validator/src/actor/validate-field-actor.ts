import { Actor, Action, IMap } from 'iflux2'
import { OrderedSet, fromJS } from 'immutable'

export default class ValidateFieldActor extends Actor {
  defaultState() {
    return {
      fields: OrderedSet()
    }
  }

  @Action('validateField')
  validateField(state: IMap, field: string) {
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
  reset(state: IMap) {
    return state.update('fields', (fields) => fields.clear());
  }
}

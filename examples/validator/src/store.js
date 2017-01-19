//@flow
import { Store } from 'iflux2'
import UserActor from './actor/user-actor'
import ValidateFieldActor from './actor/validate-field-actor'

import type {StoreOptions} from 'iflux2'

export default class AppStore extends Store {
  constructor(props: StoreOptions) {
    super(props)
    window.store = this
  }

  bindActor() {
    return [
      new UserActor,
      new ValidateFieldActor
    ]
  }

  //;;;;;;;;;;;;;;;;handle action;;;;;;;;;;;;;;;;;;;;
  changeValue = (name: string, value: string) => {
    this.dispatch('changeValue', {name, value})
    this.dispatch('validateField', name)
  };

  validateField = (name: string) => {
    this.dispatch('validateField', name)
  };

  reset = () => {
    this.dispatch('reset')
  };

}

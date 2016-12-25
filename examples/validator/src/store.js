//@flow
import { Store } from 'iflux2'
import UserActor from './actor/user-actor'
import ValidateFieldActor from './actor/validate-field-actor'

type Options = {
  debug: boolean;
}

export default class AppStore extends Store {
  constructor(props: Options) {
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

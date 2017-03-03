import { Store, IOptions } from 'iflux2'
import CounterActor from './actor/counter-actor'

export default class AppStore extends Store {
  bindActor() {
    return [
      new CounterActor
    ]
  }

  constructor(props: IOptions) {
    super(props)
    if (__DEV__) {
      window['store'] = this
    }
  }

  increment = () => {
    this.dispatch('increment')
  };

  decrement = () => {
    this.dispatch('decrement')
  };
}

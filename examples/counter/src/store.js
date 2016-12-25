//@flow
import { Store } from 'iflux2'
import CounterActor from './actor/counter-actor'


//State container
export default class AppStore extends Store {
  bindActor() {
    return [
      new CounterActor
    ]
  }

  constructor(props: {debug: boolean} = {debug: false}) {
    super(props)
    //debug
    //you can quickly test in chrome
    if (__DEV__) {
      window.store = this
    }
  }

  //;;;;;;;;;;;;;;;;;Action;;;;;;;;;;;;;;;;;;;;;;;;;;;;
  increment = () => {
    this.dispatch('increment')
  };

  decrement = () => {
    this.dispatch('decrement')
  };
}

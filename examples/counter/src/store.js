//@flow

'use strict;'

import { Store } from 'iflux2'
import CounterActor from './actor/counter-actor'

import type {StoreOptions} from 'iflux2'


//State container
export default class AppStore extends Store {
  bindActor() {
    return [
      new CounterActor
    ]
  }

  constructor(props: StoreOptions) {
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

//@flow

'use strict;'

import { Store } from 'iflux2'
import TimerActor from './actor/timer-actor'

import type {StoreOptions} from 'iflux2'

export default class AppStore extends Store {
  timer: number;

  bindActor() {
    return [
      new TimerActor
    ]
  }

  constructor(props: StoreOptions) {
    super(props)
    //debug,you can quickly test in chrome
    if (__DEV__) {
      window.store = this
    }
  }

  //;;;;;;;;;;;;;;;;;Action;;;;;;;;;;;;;;;;;;;;;;;;;;;;
  start = () => {
    this.timer = setInterval(() => {
      this.dispatch('start')
    }, 1000);
  };

  reset = () => {
    clearTimeout(this.timer);
    this.dispatch('reset')
  };
}

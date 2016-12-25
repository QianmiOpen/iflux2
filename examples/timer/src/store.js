//@flow
import { Store } from 'iflux2'
import TimerActor from './actor/timer-actor'

type Options = {
  debug: boolean;
}

export default class AppStore extends Store {
  timer: number;
  
  bindActor() {
    return [
      new TimerActor
    ]
  }

  constructor(props: Options = {debug: true}) {
    super(props)
    //debug,you can quickly test in chrome
    window.store = this
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

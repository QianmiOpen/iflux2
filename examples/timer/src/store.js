import { Store } from 'iflux2'
import TimerActor from './actor/timer-actor'


export default class AppStore extends Store {
  bindActor() {
    return [
      new TimerActor
    ]
  }

  constructor(props) {
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

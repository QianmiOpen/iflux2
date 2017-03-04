import { Store, IOptions } from 'iflux2'
import TimerActor from './actor/timer-actor'

export default class AppStore extends Store {
  timer: any;

  bindActor() {
    return [
      new TimerActor
    ]
  }

  constructor(props: IOptions) {
    super(props)
    //debug,you can quickly test in chrome
    if (__DEV__) {
      window['store'] = this
    }
  }

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

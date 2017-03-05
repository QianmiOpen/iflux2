import { Store, IOptions } from 'iflux2'
import HelloActor from "./actor/hello-actor"
import CounterActor from "./actor/counter-actor"

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props)
    if (__DEV__) {
      //debug
      window['hello'] = this
    }
  }

  bindActor() {
    return [
      new HelloActor,
      new CounterActor,
    ]
  }

  like = (text: string) => {
    this.dispatch('like')
  };
}
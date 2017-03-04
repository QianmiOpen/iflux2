import { Actor, Action, IMap } from 'iflux2';

export default class TextActor extends Actor {
  defaultState() {
    return {
      value: ''
    };
  }

  @Action('changeValue')
  changeValue(state: IMap, value: string) {
    return state.set('value', value);
  }

  @Action('submit')
  submit(state: IMap) {
    return state.set('value', '')
  }

  @Action('init')
  init(state: IMap, value: string) {
    return state.set('value', value)
  }
}

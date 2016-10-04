import {Actor, Action} from 'iflux2';

export default class TextActor extends Actor {
  defaultState() {
    return {
      value: ''
    };
  }

  @Action('changeValue')
  changeValue(state, value) {
    return state.set('value', value);
  }

  @Action('submit')
  submit(state) {
    return state.set('value', '')
  }

  @Action('init')
  init(state, {value}) {
    return state.set('value', value)
  }
}

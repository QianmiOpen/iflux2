//@flow
import {Actor, Action} from 'iflux2';
import type {Map} from 'immutable'

type State = Map<string, string>;

export default class TextActor extends Actor {
  defaultState() {
    return {
      value: ''
    };
  }

  @Action('changeValue')
  changeValue(state: State, value: {value: string}) {
    return state.set('value', value);
  }

  @Action('submit')
  submit(state: State) {
    return state.set('value', '')
  }

  @Action('init')
  init(state: State, {value}: {value: string}) {
    return state.set('value', value)
  }
}

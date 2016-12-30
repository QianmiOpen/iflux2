//@flow

'use strict;'

import {Actor, Action} from 'iflux2';

import type {ActorState} from 'iflux2'

type Value = {
  value: string;
}

export default class TextActor extends Actor {
  defaultState() {
    return {
      value: ''
    };
  }

  @Action('changeValue')
  changeValue(state: ActorState, value: Value) {
    return state.set('value', value);
  }

  @Action('submit')
  submit(state: ActorState) {
    return state.set('value', '')
  }

  @Action('init')
  init(state: ActorState, {value}: Value) {
    return state.set('value', value)
  }
}

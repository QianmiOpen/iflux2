//@flow

'use strict;'

import { Action, Actor } from 'iflux2'

export default class TextActor extends Actor {
  defaultState() {
    return {
      text: 'Hello, ReactNative!!!'
    }
  }

  @Action('change')
  change(state, text) {
    return state.set('text', text)
  }
}

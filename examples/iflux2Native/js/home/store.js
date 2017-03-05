//@flow

'use strict;'

import { Store } from 'iflux2'

import TextActor from './actor/text-actor'
import LoadingActor from './actor/loading-actor'

import type {StoreOptions } from 'iflux2'

export default class AppStore extends Store {
  constructor(props: StoreOptions) {
    super(props)
    //dev mode
    if (__DEV__) {
      window._store = this
    }
  }

  bindActor() {
    return [
      new TextActor,
      new LoadingActor
    ]
  }

  //;;;;;;;;;;;;;;action;;;;;;;;;;;;
  loadingSuccess = () => {
    this.dispatch('loading:success')
  };

  change = () => {
    this.dispatch('change', 'hello world!')
  }
}

//@flow

'use strict;'

import React, { Component } from 'react'
import { render } from 'react-dom'
import { StoreProvider } from 'iflux2'
import AppStore from './store'
import Counter from './component/counter'

//debug: true
//it will print more iflux2 trace log
@StoreProvider(AppStore, {debug: true})
export default class CounterApp extends Component {
  render() {
    return <Counter/>
  }
}

render(<CounterApp/>, document.getElementById('app'))

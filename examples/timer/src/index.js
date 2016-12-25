//@flow
import React, { Component } from 'react'
import { render } from 'react-dom'
import { StoreProvider } from 'iflux2'
import AppStore from './store'
import Timer from './component/timer'

//debug: true
//it will print more iflux2 trace log
@StoreProvider(AppStore, {debug: true})
export default class TimerApp extends Component {
  render() {
    return <Timer/>
  }
}


render(<TimerApp/>, document.getElementById('app'))

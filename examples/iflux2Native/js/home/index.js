import React, { Component } from 'react'
import { StoreProvider } from 'iflux2'
import Title from './component/title'
import AppStore from './store'

@StoreProvider(AppStore)
export default class HomeApp extends Component {
  render() {
    return <Title/>
  }
}

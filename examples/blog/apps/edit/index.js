//@flow
import React, { Component} from 'react'
import Edit from './component/edit'
import { StoreProvider } from 'iflux2'
import AppStore from './store'


@StoreProvider(AppStore, {debug: true})
export default class BlogEdit extends Component {
  render() {
    return (
      <Edit/>
    )
  }
}

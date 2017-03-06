import * as React from 'react'
import Edit from './component/edit'
import { StoreProvider } from 'iflux2'
import AppStore from './store'


@StoreProvider(AppStore, { debug: true })
export default class BlogEdit extends React.Component<any, any> {
  render() {
    return (
      <Edit />
    )
  }
}

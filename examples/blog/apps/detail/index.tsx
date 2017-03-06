import * as React from 'react'
import { StoreProvider } from 'iflux2'
import AppStore from './store'
import Detail from './component/detail'

@StoreProvider(AppStore, { debug: true })
export default class BlogDetail extends React.Component<any, any>{
  componentDidMount() {
    this.props.store.init(this.props.params.id)
  }

  render() {
    return (
      <Detail />
    )
  }
}

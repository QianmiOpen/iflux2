import * as React from 'react'
import { StoreProvider } from 'iflux2'
import AppStore from './store'
import BlogList from './component/blog-list'

@StoreProvider(AppStore, { debug: true })
export default class BlogListApp extends React.Component<any, any> {
  componentDidMount() {
    this.props.store.init()
  }

  render() {
    return (
      <BlogList />
    )
  }
}

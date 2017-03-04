import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { StoreProvider } from 'iflux2'
import AppStore from './store'

import Header from './component/header'
import Main from './component/main-section'
import Footer from './component/footer'

import './css/base.css'
import './css/index.css'

//debug: true, it will show good logs
@StoreProvider(AppStore, { debug: true })
export default class TodoApp extends React.Component<any, any> {
  render() {
    return (
      <section className="todoapp">
        <Header />
        <Main />
        <Footer />
      </section>
    );
  }
}

ReactDOM.render(<TodoApp />, document.getElementById('app'))

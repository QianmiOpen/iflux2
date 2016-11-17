import React, {Component} from 'react'

import {render} from 'react-dom'
import {StoreProvider} from 'iflux2'
import AppStore from './store'
import Header from './component/header'
import Main from './component/main-section'
import Footer from './component/footer'

import './css/base.css'
import './css/index.css'


//debug: true, it will show good logs
@StoreProvider(AppStore, {debug: true})
export default class TodoApp extends Component {
  render() {
    return (
      <section className="todoapp">
        <Header/>
        <Main/>
        <Footer/>
      </section>
    );
  }
}


render(<TodoApp/>, document.getElementById('app'));

'use strict;'

import React, { Component } from 'react'
import { render } from 'react-dom'
import {
  Router,
  Route,
  IndexRoute,
  Link,
  hashHistory
} from 'react-router'

class Blog extends Component {
  render() {
    return (
      <div>
        <h3>
          <Link to="/new">new post...</Link>
        </h3>
        { this.props.children }
      </div>
    )
  }
}

render((
  <Router history={hashHistory}>
    <Router path="/" component={ Blog }>
      <IndexRoute getComponent={(location, cb) => {
        System
          .import('./list')
          .then(List => cb(null, List.default))
      }}/>

      <Route path="new" getComponent={(location, cb) => {
        System
          .import('./edit')
          .then(Edit => cb(null, Edit.default))
      }}/>

      <Route path="detail/:id" getComponent={(location, cb) => {
        System
          .import('./detail')
          .then(Detail => cb(null, Detail.default))
      }}/>
    </Router>
  </Router>
), document.getElementById('app'))

import React, { Component } from 'react'
import { Relax } from 'iflux2'
import { countQL } from '../ql'
const noop = () => {}


@Relax
export default class Counter extends Component {
  static defaultProps = {
    count: 0,
    countQL,
    increment: noop,
    decrement: noop
  };


  render() {
    const { count, countQL, increment, decrement } = this.props

    return (
      <div>
        <a href='javascript:void(0);' onClick={increment}>increment</a>
        <br/>
        <span>{ count }</span>
        <br/>
        <span>{ countQL }</span>
        <br/>
        <a href='javascript:void(0);' onClick={decrement}>decrement</a>
      </div>
    )
  }
}

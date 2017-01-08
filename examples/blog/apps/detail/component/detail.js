//@flow
import React, { Component } from 'react'
import { Relax } from 'iflux2'

@Relax
export default class Detail extends Component {
  static defaultProps = {
    title: '',
    createAt: '',
    content: ''
  };

  render() {
    const {
      title,
      createAt,
      content
    } = this.props

    return (
      <div>
        <h3>{ title }</h3>
        <h4>{ createAt }</h4>
        <p>{ content }</p>
      </div>
    )
  }
}

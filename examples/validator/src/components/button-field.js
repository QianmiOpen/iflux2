import React, { Component } from 'react'


export default class Button extends Component {
  render() {
    return (
      <tr>
        <td colSpan="2">
          {this.props.children}
        </td>
      </tr>
    )
  }
}

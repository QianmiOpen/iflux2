import React, { Component } from 'react'

export default class FormField extends Component {
  render() {
    const {error, label, required} = this.props

    return (
      <tr>
        <td>
          <label>
          {required
            ? <span style={style}>*</span>
            : null}
          {label}
          </label>
        </td>
        <td>
          {this.props.children}
          {error
            ? <span style={style}>{error}</span>
            : null}
        </td>
      </tr>
    )
  }
}

const style = {
  color: 'red'
};

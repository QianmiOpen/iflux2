import * as React from 'react'

export default class Button extends React.Component<any, any> {
  render() {
    return (
      <tr>
        <td colSpan={2}>
          {this.props.children}
        </td>
      </tr>
    )
  }
}

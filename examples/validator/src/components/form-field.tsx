import * as React from 'react'

export default class FormField extends React.Component<any, any> {
  props: {
    error?: Error;
    label?: string;
    required?: boolean;
    children?: any;
  };

  render() {
    const { error, label, required } = this.props

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

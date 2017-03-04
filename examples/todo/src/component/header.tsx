import * as React from 'react'
import { Relax } from 'iflux2'
import { valueQL } from '../ql'

const noop = () => { };

@Relax
export default class Header extends React.Component<any, any> {
  props: {
    value?: string;
    submit?: () => void;
    changeValue?: (text: string) => void;
  };

  static defaultProps = {
    value: valueQL,
    submit: noop,
    changeValue: noop,
  };

  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <input value={this.props.value}
          className="new-todo"
          onKeyDown={this._handleKeyDown}
          onChange={this._handleChange}
          placeholder="What needs to be done?"
          autoFocus />
      </header>
    );
  }

  _handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.changeValue(e.target.value);
  };


  _handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      this.props.submit();
    }
  };
}

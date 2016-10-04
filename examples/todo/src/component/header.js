import React, {Component} from 'react';
import {Relax} from 'iflux2'
import {valueQL} from '../ql'
const noop = () => {};


@Relax
export default class Header extends Component {
  static defaultProps = {
    value: valueQL,
    submit: noop,
    changeValue: noop
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

  _handleChange = (e) => {
    this.props.changeValue(e.target.value);
  };


  _handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.props.submit();
    }
  };
}

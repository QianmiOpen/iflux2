//@flow
import React, {Component} from 'react';
import {Relax} from 'iflux2'
import {countQL} from '../ql'
const noop = () => {}


@Relax
export default class Footer extends Component {
  static defaultProps = {
    changeFilter: noop,
    clearCompleted: noop,
    filterStatus: '',
    count: countQL
  };


  render() {
    const {changeFilter, filterStatus, count, clearCompleted} = this.props
    let countText = ''

    if (count > 1) {
      countText = `${count} items left`
    } else if (count === 1) {
      countText = '1 item left'
    }

    return (
      <footer className="footer">
        <span className="todo-count">{countText}</span>
        <ul className="filters">
          <li>
            <a href="javascript:;"
              className={"" === filterStatus ? 'selected' : ''}
              onClick={() => changeFilter('')}>
              All
            </a>
          </li>
          <li>
            <a href="javascript:;"
              className={"active" === filterStatus ? 'selected' : ''}
              onClick={() => changeFilter('active')}>
              Active
            </a>
          </li>
          <li>
            <a href="javacript:;"
              className={'completed' === filterStatus ? 'selected' : ''}
              onClick={() => changeFilter('completed')}>
              Completed
            </a>
          </li>
        </ul>
        <button className="clear-completed"
                onClick={clearCompleted}>Clear completed</button>
      </footer>
    );
  }
}

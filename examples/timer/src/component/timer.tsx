import * as React from 'react'
import { Relax } from 'iflux2'
const noop = () => { }

@Relax
export default class Counter extends React.Component<any, any> {
  props: {
    time?: number;
    start?: () => void;
    reset?: () => void;
  };

  static defaultProps = {
    time: 0,
    start: noop,
    reset: noop,
  };

  render() {
    const { time, start, reset } = this.props

    const style = {
      marginLeft: 10,
      marginRight: 10,
      fontSize: 18,
      color: 'red'
    }

    return (
      <div>
        <a href='javascript:void(0);' onClick={start}>start</a>
        <span style={style}>{time}</span>
        <a href='javascript:void(0);' onClick={reset}>reset</a>
      </div>
    )
  }
}

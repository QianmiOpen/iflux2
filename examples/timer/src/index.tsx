import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { StoreProvider } from 'iflux2'
import AppStore from './store'
import Timer from './component/timer'

@StoreProvider(AppStore, { debug: __DEV__ })
export default class TimerApp extends React.Component<any, any> {
  render() {
    return <Timer />
  }
}

ReactDOM.render(<TimerApp />, document.getElementById('app'))

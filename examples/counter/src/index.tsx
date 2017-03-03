import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { StoreProvider } from 'iflux2'
import AppStore from './store'
import Counter from './component/counter'

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CounterApp extends React.Component<any, any> {
  render() {
    return <Counter />
  }
}

ReactDOM.render(<CounterApp />, document.getElementById('app'))

import * as React from 'react'
import { render } from 'react-dom'
import { StoreProvider } from 'iflux2'
import AppStore from './store'
import Form from './components/form'


@StoreProvider(AppStore, { debug: true })
class ValidatorApp extends React.Component<any, any> {
  render() {
    return (
      <Form />
    )
  }
}

render(<ValidatorApp />, document.getElementById('app'));

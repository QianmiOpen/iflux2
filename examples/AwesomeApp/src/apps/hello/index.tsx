import * as React from "React"
import { StoreProvider } from 'iflux2'
import AppStore from "./store"
import Hello from "./component/hello";


@StoreProvider(AppStore, { debug: true })
export default class HelloApp extends React.Component<any, any> {
  render() {
    return (
      <Hello />
    )
  }
}
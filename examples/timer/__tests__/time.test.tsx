import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { StoreProvider } from 'iflux2'
import Timer from '../src/component/timer'
import Store from '../src/store'

@StoreProvider(Store)
class TimerApp extends React.Component<any, any> {
  render() {
    return <Timer />
  }
}

describe('Relax Counter', () => {
  it('test counter', () => {
    const component = renderer.create(<TimerApp />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    window['store'].dispatch('start');
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
})
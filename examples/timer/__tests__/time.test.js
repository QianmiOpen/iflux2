import Timer from '../src/component/timer'
import renderer from 'react-test-renderer';
import React, {Component} from 'react'
import Store from '../src/store'
import {StoreProvider} from 'iflux2'

@StoreProvider(Store)
class TimerApp extends Component {
  render() {
    return <Timer/>
  }
}

describe('Relax Counter', () => {
  it('test counter', () => {
    const component = renderer.create(<TimerApp/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    window.store.dispatch('start');
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();    
  })
})
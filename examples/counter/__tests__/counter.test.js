import Counter from '../src/component/counter'
import renderer from 'react-test-renderer';
import React from 'react'
import Store from '../src/store'
import {StoreProvider} from 'iflux2'

@StoreProvider(Store)
class App extends React.Component{
  render() {
    return <Counter/>
  }
}

describe('Relax Counter', () => {
  it('test counter', () => {
    const component = renderer.create(<App/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // tree.props.increment();
    window.store.increment();
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();    
  })
})
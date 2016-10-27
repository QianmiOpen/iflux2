import React from 'react'
import renderer from 'react-test-renderer';
import Relax from '../src/relax'
import StoreProvider from '../src/store-provider';
import Store from '../src/store'
import Actor from '../src/actor'
import {Action} from '../src/decorator'

//;;;;;;;;;;Actor;;;;;;;;;;;;;;;;;;
class TestActor extends Actor {
  defaultState() {
    return {
      text: 'hello world'
    }
  }

  @Action('init')
  init(state, text) {
    return state.set('text', text);
  }
}


//;;;;;;;;;;;;;;;Store;;;;;;;;;;;;;;;
class AppStore extends Store  {
  bindActor() {
    return [
      new TestActor()
    ]
  }

  init = () => {
    this.dispatch('init', 'hello iflux2');
  };
}

//;;;;;;;;;;;;;;;;Relax;;;;;;;;;;;;;;;
@Relax
class Text extends React.Component {
  static defaultProps = {
    text: ''
  };

  render() {
    return (
      <div>{this.props.text}</div>
    )
  }
}

//;;;;;;;;;;;;;;;;;;root;;;;;;;;;;;;;
@StoreProvider(AppStore)
class HelloApp extends React.Component {
  componentWillMount() {
    this.props.store.init();
  }

  render() {
    return (
      <Text/>
    )
  }
}

//;;;;;;;;;;;test;;;;;;;;;;;;;;;;;;;;;
test('test store provider and relax', () => {
  const tree = renderer.create(<HelloApp/>).toJSON();
  expect(tree).toMatchSnapshot();
});
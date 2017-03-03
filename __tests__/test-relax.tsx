import * as React from 'react'
import * as renderer from 'react-test-renderer';
import { Actor, Action, Store, Relax, StoreProvider } from "../src/index";
jest.mock('react-dom');

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
class AppStore extends Store {
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
  props: {
    text: string;
  };

  static defaultProps = {
    text: ''
  };

  render() {
    expect(this.props.text).toEqual('hello iflux2');
    return (
      <div>{this.props.text}</div>
    )
  }
}

//;;;;;;;;;;;;;;;;;;root;;;;;;;;;;;;;
@StoreProvider(AppStore)
class HelloApp extends React.Component {
  props: {
    store: AppStore;
  };

  componentWillMount() {
    this.props.store.init();
  }

  render() {
    return (
      <Text />
    )
  }
}

//;;;;;;;;;;;test;;;;;;;;;;;;;;;;;;;;;
test('test store provider and relax', () => {
  const tree = renderer.create(<HelloApp />).toJSON();
  expect(tree).toMatchSnapshot();
});
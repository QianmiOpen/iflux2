import * as React from 'react'
import * as renderer from 'react-test-renderer';
import { Action, Actor, StoreProvider, Store, Relax, CtxStoreName } from '../src'
jest.mock('react-dom');

//;;;;;;;;;;;;;;;;;;;Actor;;;;;;;;;;;;;;;;;;;;;
class HelloActor extends Actor {
  defaultState() {
    return {
      text: 'hello'
    }
  }
}

class CounterActor extends Actor {
  defaultState() {
    return {
      counter: 1
    }
  }
}

//;;;;;;;;;;;;; Store;;;;;;;;;;;;;;;;;;;;;;;;;
class AppStore extends Store {
  bindActor() {
    return [
      new HelloActor
    ]
  }
}

class AppStore1 extends Store {
  bindActor() {
    return [
      new CounterActor
    ]
  }
}

//;;;;;;;;;;;;;;;;;;;HelloApp;;;;;;;;;;;;;;;;;;;;;
@Relax
class Text extends React.Component {
  props: {
    text: string;
  };

  static defaultProps = {
    text: ''
  };

  render() {
    return (
      <div>{this.props.text}</div>
    )
  }
}

@StoreProvider(AppStore)
class HelloApp extends React.Component {
  render() {
    return (
      <Text />
    )
  }
}


//;;;;;;;;;;;;;;;;;CounterApp;;;;;;;;;;;;;;;;
@Relax
class Counter extends React.Component {
  props: {
    counter: number;
  };

  static defaultProps = {
    counter: 0
  };

  render() {
    return (
      <div>{this.props.counter}</div>
    )
  }
}


@StoreProvider(AppStore1)
class CounterApp extends React.Component {
  render() {
    return (<Counter />);
  }
}


describe('test multiple store context', () => {
  it('test HelloApp', () => {
    const tree = renderer.create(<HelloApp />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('test CounterApp', () => {
    const tree = renderer.create(<CounterApp />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('multiple context', () => {

    @Relax
    @CtxStoreName('_counterStore')
    class Counter extends React.Component {
      props: {
        counter: number;
      };

      static defaultProps = {
        counter: 0
      };

      render() {
        return <div>{this.props.counter}</div>
      }
    }

    @Relax
    class Hello extends React.Component {
      props: {
        text: string;
      };

      static defaultProps = {
        text: ''
      };

      render() {
        return (
          <div>
            {this.props.text}
            <Counter />
          </div>
        )
      }
    }

    @StoreProvider(AppStore)
    class HelloApp extends React.Component {
      render() {
        return <Hello />
      }
    }

    @StoreProvider(AppStore1, {
      ctxStoreName: '_counterStore'
    })
    class CounterApp extends React.Component {
      render() {
        return <HelloApp />
      }
    }

    const tree = renderer.create(<CounterApp />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('binding context', () => {
    @Relax
    class Counter extends React.Component {
      props: {
        counter: number;
      };

      static defaultProps = {
        counter: 0
      };

      render() {
        return <div>{this.props.counter}</div>
      }
    }

    @Relax
    class Hello extends React.Component {
      props: {
        text: string;
      };

      static defaultProps = {
        text: ''
      };

      render() {
        return (
          <div>
            {this.props.text}
            <Counter />
          </div>
        )
      }
    }

    @StoreProvider(AppStore)
    class HelloApp extends React.Component {
      render() {
        return <Hello />
      }
    }

    @StoreProvider(AppStore1)
    class CounterApp extends React.Component {
      render() {
        return <HelloApp />
      }
    }

    const tree = renderer.create(<CounterApp />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

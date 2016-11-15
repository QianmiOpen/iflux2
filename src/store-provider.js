/**
 * StoreProvider
 * 主要的作用是在Store和React的App之间建立桥梁
 * 将Store初始化,切绑定到React顶层App的上下文
 * @flow
 */
import React from 'react';

type Store = {
  subscribe: (callback: Function) => void;
  unsubscribe: (callback: Function) => void;
};

type Options = {
  debug: boolean;
};

/**
 * WrapperComponent
 * @param AppStore
 * @param opts
 * @returns {Function}
 */
export default function connectToStore(
  AppStore: Store,
  opts: Options = {}
) {
  return function (Component: ReactClass<{}>) {
    //proxy Component componentDidMount
    const proxyDidMount = Component.prototype.componentDidMount || (() => {});
    //清空
    Component.prototype.componentDidMount = () => {};

    return class StoreContainer extends React.Component {
      //关联的store
      _store: Object;
      //当前的组件状态
      _isMounted: boolean;

      static childContextTypes = {
        store: React.PropTypes.object
      };

      getChildContext: Function = (): Object => {
        return {
          store: this._store
        };
      };

      constructor(props: Object) {
        super(props);
        //如果是debug状态
        if (opts.debug) {
          console.group(`StoreProvider(${Component.name}) in debug mode.`);
        }

        //初始化当前的组件状态
        this._isMounted = false;
        //初始化Store
        this._store = new AppStore(opts);
      }

      componentWillMount() {
        this._isMounted = false;
        if (opts.debug) {
          console.time('first-render-time');
        }
      }

      componentDidMount() {
        if (opts.debug) {
          console.timeEnd('first-render-time');
          console.groupEnd();
        }
        this._isMounted = true;
        this._store.subscribe(this._handleStoreChange);

        //代理的子componentDidMount执行一次
        if (this.App) {
          proxyDidMount.call(this.App);
        }
      }

      componentWillUpdate() {
        this._isMounted = false;
        if (opts.debug) {
          console.time('update-render-time');
        }
      }

      componentDidUpdate() {
        this._isMounted = true;
        if (opts.debug) {
          console.timeEnd('update-render-time')
          console.groupEnd();
        }
      }

      componentWillUnmount() {
        this._store.unsubscribe(this._handleStoreChange);
      }


      render() {
        return (
          <Component 
            ref={(App) => this.App = App} 
            {...this.props} 
            store={this._store} 
          />
        );
      }


      _handleStoreChange = () => {
        if (this._isMounted) {
          this.forceUpdate();
        }
      };
    }
  }
}

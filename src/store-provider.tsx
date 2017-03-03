/**
 * StoreProvider
 * 主要的作用是在Store和React的App之间建立桥梁
 * 将Store初始化,切绑定到React顶层App的上下文
 */

import * as React from 'react';
import Store from './store';

type TStore = typeof Store;
type StoreOptions = {
  debug?: boolean;
  ctxStoreName?: string;
};

/**
 * WrapperComponent
 * @param AppStore
 * @param opts
 * @returns {Function}
 */
export default function connectToStore(
  AppStore: TStore,
  opts: StoreOptions = { debug: false, ctxStoreName: '_iflux2$store' }
): React.Component {
  return function (Component: React.Component) {
    //获取上下午动态设置的store的名称
    //避免Relax在获取context的时候就近原则的冲突
    const ctxStoreName = opts.ctxStoreName || '_iflux2$store';
    //proxy Component componentDidMount
    const proxyDidMount = Component.prototype.componentDidMount || (() => { });
    //reset
    Component.prototype.componentDidMount = () => { };

    return class StoreContainer extends React.Component {
      props: Object;

      //关联的store
      _store: Store;
      //当前的组件状态
      _isMounted: boolean;
      //获取当前的ref
      App: Object;

      static displayName = `StoreProvider(${getDisplayName(Component)})`;

      static childContextTypes = {
        [ctxStoreName]: React.PropTypes.object
      };

      getChildContext() {
        return {
          [ctxStoreName]: this._store
        };
      };

      constructor(props: Object) {
        super(props);

        if (process.env.NODE_ENV != 'production') {
          //如果是debug状态
          if (opts.debug) {
            console.group && console.group(`StoreProvider(${Component.name}) in debug mode. 🔥`);
          }
        }

        //初始化当前的组件状态
        this._isMounted = false;
        //初始化Store
        this._store = new AppStore(opts);
        this._store.subscribe(this._handleStoreChange);
      }

      componentDidMount() {
        if (process.env.NODE_ENV != 'production') {
          if (opts.debug) {
            console.groupEnd && console.groupEnd();
          }
        }

        this._isMounted = true;

        //代理的子componentDidMount执行一次
        if (this.App) {
          proxyDidMount.call(this.App);
        }
      }

      componentWillUpdate() {
        this._isMounted = false;

        if (process.env.NODE_ENV != 'production') {
          if (opts.debug) {
            console.group && console.group(`StoreProvider(${Component.name}) will update 🚀`);
          }
        }
      }

      componentDidUpdate() {
        this._isMounted = true;

        if (process.env.NODE_ENV != 'production') {
          if (opts.debug) {
            console.groupEnd && console.groupEnd();
          }
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
          (this as any).forceUpdate();
        }
      };
    }
  };

  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
  }
}

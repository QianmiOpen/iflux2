/**
 * StoreProvider
 * 主要的作用是在Store和React的App之间建立桥梁
 * 将Store初始化,切绑定到React顶层App的上下文
 * @flow
 */

'use strict';

import React from 'react';

import type Store from './store'
import type {StoreOptions} from './types'

//高阶函数包装类型
type WrapperComponent = (Cmp: ReactClass<{}>) => ReactClass<{}>;

/**
 * WrapperComponent
 * @param AppStore
 * @param opts
 * @returns {Function}
 */
export default function connectToStore(
  AppStore: (opts: StoreOptions) => Store,
  opts: StoreOptions = {debug: false, ctxStoreName: 'store'}
): WrapperComponent {
  return function (Component: ReactClass<{}>) {
    //获取上下午动态设置的store的名称
    //避免Relax在获取context的时候就近原则的冲突
    const ctxStoreName = opts.ctxStoreName;

    //proxy Component componentDidMount
    const proxyDidMount = Component.prototype.componentDidMount || (() => {});
    //清空
    Component.prototype.componentDidMount = () => {};

    return class StoreContainer extends React.Component {
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

      getChildContext: Function = (): Object => {
        return {
          [ctxStoreName]: this._store
        };
      };

      constructor(props: Object) {
        super(props);

        if (process.env.NODE_ENV != 'production') {
          //如果是debug状态
          if (opts.debug) {
            console.group(`StoreProvider(${Component.name}) in debug mode.`);
            console.time('first-render-time');
          }
        }

        //初始化当前的组件状态
        this._isMounted = false;
        //初始化Store
        this._store = new AppStore(opts);
      }

      componentDidMount() {
        if (process.env.NODE_ENV != 'production') {
          if (opts.debug) {
            console.timeEnd('first-render-time');
            console.groupEnd();
          }
        }

        this._isMounted = true;
        this._store.subscribeStoreProvider(this._handleStoreChange);

        //代理的子componentDidMount执行一次
        if (this.App) {
          proxyDidMount.call(this.App);
        }
      }

      componentWillUpdate() {
        this._isMounted = false;

        if (process.env.NODE_ENV != 'production') {
          if (opts.debug) {
            console.group(`StoreProvider(${Component.name}) will update`);
            console.time('update-render-time');
          }
        }
      }

      componentDidUpdate() {
        this._isMounted = true;

        if (process.env.NODE_ENV != 'production') {
          if (opts.debug) {
            console.timeEnd('update-render-time');
            console.groupEnd();
          }
        }
      }

      componentWillUnmount() {
        this._store.unsubscribeStoreProvider(this._handleStoreChange);
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


      _handleStoreChange = (cb: Function) => {
        if (this._isMounted) {
          this.forceUpdate(() => cb());
        }
      };
    }
  };

  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
  }
}

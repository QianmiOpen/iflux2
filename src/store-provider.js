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
 * @returns {Function}
 */
export default function connectToStore(
  AppStore: Store,
  opts: Options = {}
) {
  return function (Component: ReactClass<{}>) {
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
          console.log(`${Component.name} will mount...`);
          console.time('first-render-time');
        }
      }

      componentDidMount() {
        if (opts.debug) {
          console.log(`${Component.name} did mount`);
          console.timeEnd('first-render-time');
          console.groupEnd();
        }
        this._isMounted = true;
        this._store.subscribe(this._handleStoreChange);
      }

      componentWillUpdate() {
        this._isMounted = false;
        if (opts.debug) {
          console.group(`${Component.name} will update`);
          console.time('update-render-time');
        }
      }

      componentDidUpdate() {
        this._isMounted = true;
        if (opts.debug) {
          console.log(`${Component.name} did update`)
          console.timeEnd('update-render-time')
          console.groupEnd();
        }
      }

      componentWillUnmount() {
        this._store.unsubscribe(this._handleStoreChange);
      }


      render() {
        return (
          <Component {...this.props} store={this._store} />
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

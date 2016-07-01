/**
 * StoreProvider
 * 主要的作用是在Store和React的App之间建立桥梁
 * 将Store初始化,切绑定到React顶层App的上下文
 * @flow
 */
import React from 'react';


/**
 * WrapperComponent
 * @param AppStore
 * @returns {Function}
 */
export default function connectToStore(AppStore: Function, opts: Object = {}) {
  return function(Component: Function) {
    return class StoreContainer extends React.Component {
      _store: Object;

      
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
          console.group(`StoreProvider ${Component.name} debug mode`);
        }
        //初始化Store
        this._store = new AppStore(opts);
      }


      componentDidMount() {
        if (opts.debug) {
          console.groupEnd();
        }
      }


       render() {
         return (
           <Component {...this.props} store={this._store}/>
         );
       }
    }
  }
}

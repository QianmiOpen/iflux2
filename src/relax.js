/**
 * 致敬Reley,更希望我们小伙伴可以relax
 *
 * Relax根据containerComponent的defaultProps
 * 自动数据依赖注入, 数据源优先级为:
 * 1. this.props
 * 2. store的action函数
 * 3. query-lang
 * 4. store的state
 * 5. 组件设置的默认值
 *
 * @flow
 */

'use strict';

import React from 'react';
import {fromJS} from 'immutable';
import assign from 'object-assign';

import {QueryLang} from './ql';
import {DynamicQueryLang} from './dql';

import type {IState} from './types'

type State = {
  storeState: IState;
};

type Store = {
  _debug: boolean;
  state(): IState;
  bigQuery(ql: mixed): any;
  subscribe: Function;
  unsubscribe: Function;
};

export default function Relax(
  Component: ReactClass<{}>
): ReactClass<{}> {
  //获取组件中绑定的上下文storeName的参数
  //默认是store
  const ctxStoreName = Component._ctxStoreName || '_iflux2$store';
  return class RelaxContainer extends React.Component {
     //当前的状态
     state: State;
     //当前组件的挂载状态
     _isMounted: boolean;
     //当前的所有的子组件的props
     _relaxProps: Object;
     //debug状态
     _debug: boolean;
     //当前上下文的store
     _store: Store;

     //声明上下文类型
     static contextTypes = {
       [ctxStoreName]: React.PropTypes.object
     };

     //声明displayName
     static displayName = `Relax(${getDisplayName(Component)})`;

     constructor(props) {
       super(props);
       //当前组件的挂载状态
       this._isMounted = false;
       //当前组件的状态
       this.state = {
         storeState: fromJS({})
       };
     }

    componentWillMount() {
      //设置当前组件的状态
      this._isMounted = false;
      this._store = this.context[ctxStoreName];

      //检查store是不是存在上下文
      //抛出异常方便定位问题
      if (!this._store) {
        throw new Error('Could not find any @StoreProvider bind AppStore in current context');
      }

      //在开发阶段可以有更好的日志跟踪，在线上可以drop掉log，reduce打包的体积
      if (process.env.NODE_ENV != 'production') {
        if (this._store._debug) {
          console.time('relax time');
          console.groupCollapsed(`Relax(${Component.name}) will mount`);
        }
      }

      //计算最终的props,这样写的是避免querylang的重复计算
      this._relaxProps = assign({}, this.props, this.getProps(this.props));

      if (process.env.NODE_ENV != 'production') {
        //trace log
        if (this._store._debug) {
          console.timeEnd('relax time');
          console.groupEnd();
        }
      }
    }

    componentDidMount() {
      this._isMounted = true;
      this._store.subscribe(this._subscribeStoreChange);
    }

    componentWillUpdate() {
      this._isMounted = false;
    }

    componentDidUpdate() {
      this._isMounted = true;
    }

    componentWillUnmount() {
      this._store.unsubscribe(this._subscribeStoreChange);
    }

    /**
     * 3ks immutable
     * @param nextProps
     * @returns {boolean}
     */
    shouldComponentUpdate(nextProps:Object) {
      //will drop
      if (process.env.NODE_ENV != 'production') {
        if (this._store._debug) {
          console.time('relax time');
          console.groupCollapsed(`Relax(${Component.name}) should update`);
        }
      }

      //compare nextProps && this.props
      //如果属性不一致, 就去render
      if (Object.keys(nextProps).length != Object.keys(this.props).length) {
        if (process.env.NODE_ENV != 'production') {
          if (this._store._debug) {
            console.groupEnd();
          }
        }

        return true;
      }

      //合并新的属性集合
      //判断是不是数据没有变化, 如果没有变化不需要render
      const newRelaxProps = assign({}, nextProps, this.getProps(nextProps));

      for (let key in newRelaxProps) {
        if (newRelaxProps.hasOwnProperty(key)) {
          if (newRelaxProps[key] != this._relaxProps[key]) {
            this._relaxProps = newRelaxProps;

            if (process.env.NODE_ENV != 'production') {
              //trace log
              if (this._store._debug) {
                console.timeEnd('relax time');
                console.groupEnd();
              }
            }

            return true;
          }
        }
      }

      if (process.env.NODE_ENV != 'production') {
        if (this._store._debug) {
          console.log(`Relax(${Component.name}) avoid re-render`);
          console.timeEnd('relax time');
          console.groupEnd();
        }
      }

      return false;
    }

    render() {
      return (
        <Component {... this._relaxProps}/>
      );
    }

    /**
     * 计算prop的值 然后自动注入
     *
     * 1. 默认属性是不是存在，不存在返回空对象
     * 2. 默认属性的值是不是一个合法的query-lang， 如果是就在store中通过bigQuery计算
     * 3. 默认属性是不是在父组件传递的props中，如果是取
     * 4. 是不是store得属性
     * 5. 是不是store得某个key值
     * 6. 都不是就是默认值
     */
    getProps(reactProps) {
      const dql = {};
      const props = {};
      const store = this._store;
      const defaultProps = Component.defaultProps || {};

      for (let propName in defaultProps) {
        if (defaultProps.hasOwnProperty(propName)) {

          //判断defaultProps的值是不是query的语法
          const propValue = defaultProps[propName];
          if (propValue instanceof QueryLang) {
            props[propName] = store.bigQuery(propValue);
            continue;
          }

          //隔离出来DQL
          if (propValue instanceof DynamicQueryLang) {
            dql[propName] = propValue;
          }

          props[propName] = defaultProps[propName];

          //如果默认属性中匹配上
          if (RelaxContainer._isNotUndefinedAndNull(reactProps[propName])) {
            props[propName] = reactProps[propName];
          } else if (RelaxContainer._isNotUndefinedAndNull(store[propName])) {
            props[propName] = store[propName];
          } else if (RelaxContainer._isNotUndefinedAndNull(store.state().get(propName))) {
            props[propName] = store.state().get(propName);
          }
        }
      }

      //开始计算DQL
      for (let propName in dql) {
        if (dql.hasOwnProperty(propName)) {
          props[propName] = store.bigQuery(dql[propName].context(props).ql());
        }
      }

      return props;
    }

    /**
     * 判断当前的值是不是undefined或者null
     * @param  {any} param
     */
    static _isNotUndefinedAndNull(param: any) {
      return typeof(param) != 'undefined' && null != param;
    }

    /**
     * 订阅store的变化
     */
   _subscribeStoreChange = (state: IState) => {
     if (this._isMounted) {
       //re-render
       this.setState({storeState: state});
     }
   };
  };

  /**
   * displayName
   */
  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
  }
}

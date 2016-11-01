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
import React from 'react';
import {fromJS} from 'immutable';
import {QueryLang} from './ql';
import {DynamicQueryLang} from './dql';
import assign from 'object-assign';

type State = {
  storeState: Object;
};

type ImmutableMap = mixed;

export default function Relax(
  Component: ReactClass<{}>
): ReactClass<{}> {
   return class RelaxContainer extends React.Component {
     constructor(props) {
       super(props);
       this._isMounted = false;
       this.state = {
         storeState: fromJS({})
       };
     }

    //当前的状态
    state: State;
    //当前组件的挂载状态
    _isMounted: boolean;
    //当前的所有的子组件的props
    _relaxProps: Object;
    //debug状态
    _debug: boolean;


    static contextTypes = {
      store: React.PropTypes.object
    };

    componentWillMount() {
      //设置当前组件的状态
      this._isMounted = false;

      //检查store是不是存在上下文
      if (!this.context.store) {
        throw new Error('Could not find any @StoreProvider bind AppStore in current context');
      }

      //设置debug级别
      this._debug = this.context.store._debug;
      if (this._debug) {
        console.time('relax time');
        console.groupCollapsed(`Relax(${Component.name}) will mount`);
      }

      //计算最终的props,这样写的是避免querylang的重复计算
      this._relaxProps = assign({}, this.props, this.getProps(this.props));

      //trace log
      if (this._debug) {
        console.timeEnd('relax time');
        console.groupEnd();
      }
    }

    componentDidMount() {
      this._isMounted = true;
      this.context.store.subscribe(this._subscribeStoreChange);
    }

    componentWillUpdate() {
      this._isMounted = false;
    }

    componentDidUpdate() {
      this._isMounted = true;
    }

    componentWillUnmount() {
      this.context.store.unsubscribe(this._subscribeStoreChange);
    }


    /**
     * 3ks immutable
     * @param nextProps
     * @returns {boolean}
     */
    shouldComponentUpdate(nextProps:Object) {
      if (this._debug) {
        console.time('relax time');
        console.groupCollapsed(`Relax(${Component.name}) should update`);
      }

      //compare nextProps && this.props
      //如果属性不一致, 就去render
      if (Object.keys(nextProps).length != Object.keys(this.props).length) {
        if (this._debug) {
          console.groupEnd();
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

            //trace log
            if (this._debug) {
              console.timeEnd('relax time');
              console.groupEnd();
            }

            return true;
          }
        }
      }

      if (this._debug) {
        console.log(`Relax(${Component.name}) avoid re-render`);
        console.timeEnd('relax time');
        console.groupEnd();
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
      const {store} = this.context;
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
          if (this._isNotUndefinedAndNull(reactProps[propName])) {
            props[propName] = reactProps[propName];
          } else if (this._isNotUndefinedAndNull(store[propName])) {
            props[propName] = store[propName];
          } else if (this._isNotUndefinedAndNull(store.state().get(propName))) {
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
    _isNotUndefinedAndNull(param: any) {
      return typeof(param) != 'undefined' && null != param;
    }


     _subscribeStoreChange = (state: ImmutableMap) => {
       if (this._isMounted) {
         //re-render
         this.setState({storeState: state});
       }
     };
  }
}

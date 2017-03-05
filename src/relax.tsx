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
 */
import * as React from 'react';
import { is, fromJS, OrderedMap } from 'immutable';
import Store from './store'
import { QueryLang } from './ql';
import { DynamicQueryLang } from './dql';

type State = OrderedMap<string, any>;
type RelaxContext = {
  [name: string]: Store;
};

export default function Relax(Component: React.Component): React.Component {
  //获取组件中绑定的上下文storeName的参数
  //默认是store
  const ctxStoreName = Component._ctxStoreName || '_iflux2$store';

  return class RelaxContainer extends React.Component {
    //当前的状态
    state: Object;
    //当前的属性
    props: Object;
    //当前上下文的类型
    context: RelaxContext;

    //debug状态
    _debug: boolean
    //当前组件的挂载状态
    _isMounted: boolean;;
    //当前上下文的store
    _store: Store;
    //缓存当前的dql2ql
    _dql2ql: Object;
    //当前的所有的子组件的props
    _relaxProps: Object;

    //声明上下文类型
    static contextTypes = {
      [ctxStoreName]: React.PropTypes.object
    };

    //声明displayName
    static displayName = `Relax(${getDisplayName(Component)})`;

    constructor(props: Object, context: RelaxContext) {
      super(props);

      this._dql2ql = {};
      this._isMounted = false;
      this.state = { storeState: fromJS({}) }
      this._store = context[ctxStoreName];
      this._debug = this._store._debug;

      this._store.subscribe(this._subscribeStoreChange);
    }

    componentWillMount() {
      //设置当前组件的状态
      this._isMounted = false;

      //检查store是不是存在上下文
      //抛出异常方便定位问题
      if (!this._store) {
        throw new Error('Could not find any @StoreProvider bind AppStore in current context');
      }

      //计算最终的props,这样写的是避免querylang的重复计算
      this._relaxProps = this.computedRelaxProps(this.props);

      //在开发阶段可以有更好的日志跟踪，在线上可以drop掉log，reduce打包的体积
      if (process.env.NODE_ENV != 'production') {
        if (this._debug) {
          console.groupCollapsed && console.groupCollapsed(`Relax(${Component.name}) will mount 🚀`);
          console.log('props:|>', JSON.stringify(this.props, null, 2));
          console.log('relaxProps:|>', JSON.stringify(this._relaxProps, null, 2));
          console.groupEnd && console.groupEnd();
        }
      }
    }

    componentDidMount() {
      this._isMounted = true;
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
    shouldComponentUpdate(nextProps: Object) {
      const newRelaxProps = this.computedRelaxProps(nextProps);

      if (
        !is(fromJS(newRelaxProps), fromJS(this._relaxProps)) ||
        !is(fromJS(this.props), fromJS(nextProps))) {
        this._relaxProps = newRelaxProps;

        //log trace        
        if (process.env.NODE_ENV != 'production') {
          if (this._debug) {
            console.groupCollapsed(`Relax(${Component.name}) will update 🚀`);
            console.log('props:|>', JSON.stringify(nextProps, null, 2));
            console.log('relaxProps:|>', JSON.stringify(this._relaxProps, null, 2));
            console.groupEnd();
          }
        }

        return true;
      }

      return false;
    }

    render() {
      return (
        <Component {...this.props} {... this._relaxProps} />
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
    computedRelaxProps(reactProps) {
      const dql = {} as { [name: string]: DynamicQueryLang };
      const relaxProps = {};
      const store = this._store;
      const defaultProps = Component.defaultProps || {};

      for (let propName in defaultProps) {
        //获取当前的属性值
        const propValue = defaultProps[propName];
        //先默认值
        relaxProps[propName] = propValue;

        //判断defaultProps的值是不是query的语法
        if (propValue instanceof QueryLang) {
          relaxProps[propName] = store.bigQuery(propValue);
          continue;
        }

        //隔离出来DQL
        else if (propValue instanceof DynamicQueryLang) {
          dql[propName] = propValue;

          //如果不存在转换，创建一个QL与关联
          if (!this._dql2ql[propName]) {
            //这个lang实际上并不是QueryLang需要的
            //这个lang会被后面真正被DynamicQueryLang计算过的lang取代
            this._dql2ql[propName] = new QueryLang(propValue.name(), propValue.lang());
          }

          continue;
        }

        //如果默认属性中匹配上
        if (RelaxContainer._isNotValidValue(reactProps[propName])) {
          relaxProps[propName] = reactProps[propName];
        } else if (RelaxContainer._isNotValidValue(store[propName])) {
          relaxProps[propName] = store[propName];
        } else if (RelaxContainer._isNotValidValue(store.state().get(propName))) {
          relaxProps[propName] = store.state().get(propName);
        }
      }

      //开始计算DQL
      for (let propName in dql) {
        if (dql.hasOwnProperty(propName)) {
          //取出dynamicQL
          const dqlObj = dql[propName];
          const lang = dqlObj.context(relaxProps).analyserLang(dqlObj.lang())
          const ql = this._dql2ql[propName].setLang(lang)
          relaxProps[propName] = store.bigQuery(ql);
        }
      }

      return relaxProps;
    }

    /**
     * 判断当前的值是不是undefined或者null
     * @param  {any} param
     */
    static _isNotValidValue(param: any) {
      return typeof (param) != 'undefined' && null != param;
    }

    /**
     * 订阅store的变化
     */
    _subscribeStoreChange = (state: State) => {
      if (this._isMounted) {
        (this as any).setState({
          storeState: state
        })
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

/**
 * iflux的状态容器中心(MapReduce)
 * 聚合actor, 分派action, 计算query-lang
 */
import { fromJS, OrderedMap } from 'immutable';
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom';

import Actor from './actor'
import { QueryLang } from './ql';
import { isArray, filterActorConflictKey, isFn, isStr, isObject } from './util';

type IState = OrderedMap<string, any>;
type Callback = (state: IState) => void;

type StoreOptions = {
  debug?: boolean;
  ctxStoreName?: string;
};

type ArgResult = {
  msg: string,
  param?: any
};

interface ReduxAction {
  type: string;
}

//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;Store;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
export default class Store {
  //状态变化的事件通知
  _callbacks: Array<Callback>;
  //当前的actor
  _actors: Array<Actor>;
  //actor聚合的状态
  _actorStateList: Array<IState>;
  //当前的对外暴露的状态
  _state: IState;
  //当前的状态
  _debug: boolean;
  //缓存QL的计算结果
  _cacheQL: { [index: number]: { deps: any, result: any } };
  //当前的dispatch是不是在事务中
  _isTransaction: boolean;

  /**
   * 初始化store
   * @param opts
   */
  constructor(opts: StoreOptions) {
    this._debug = opts.debug || false;
    this._isTransaction = false;

    this._state = fromJS({});
    this._cacheQL = {};
    this._callbacks = [];
    this._actorStateList = [];

    this._actors = this.bindActor();
    this._reduceActorState()
  }

  bindActor(): Array<Actor> {
    return [];
  }

  _reduceActorState() {
    this._state = this._state.withMutations(state => {
      for (let actor of this._actors) {
        let initState = fromJS(actor.defaultState());
        this._actorStateList.push(initState);
        state = state.merge(initState);
      }
      return state;
    });

    //will drop on production environment    
    if (process.env.NODE_ENV != 'production') {
      //计算有没有冲突的key
      this.debug(() => {
        const conflictList = filterActorConflictKey(this._actors);
        conflictList.forEach(v => {
          console.warn(`actor:key ‘${v[0]}’ was conflicted among ‘${v[1]}’ `);
        });
      });
    }
  }

  /**
   * 响应view层的事件,将业务分发到所有的actor
   * @param msg
   * @param param
   */
  dispatch(action: string | ReduxAction, params?: any): void {
    //校验参数是否为空
    if (!action) {
      throw new Error('😭 invalid dispatch without any arguments');
    }

    const { msg, param } = _parseArgs(action, params);
    const newStoreState = this._mapActor(msg, param);

    if (newStoreState != this._state) {
      this._state = newStoreState;
      //如果当前不是在事务中，通知页面更新
      if (!this._isTransaction) {
        this._notify();
      }
    }

    /**
     * 解析参数
     */
    function _parseArgs(action: any, extra?: any): ArgResult {
      //init
      let res: ArgResult = { msg: '', param: null };
      //兼容Redux单值对象的数据格式
      //e.g: {type: 'ADD_TO_DO', id: 1, text: 'hello iflux2', done: false}
      if (isObject(action)) {
        const { type, ...rest } = action;
        if (!type) {
          throw new Error('😭 msg should include `type` field.');
        }
        res.msg = type;
        res.param = rest;
      } else if (isStr(action)) {
        res.msg = action;
        res.param = extra;
      }

      return res;
    }
  }

  transaction(fn: Function) {
    if (process.env.NODE_ENV != 'production') {
      if (this._debug) {
        console.groupCollapsed && console.groupCollapsed('open a new transaction 🚀')
      }
    }

    const currentStoreState = this._state
    this._isTransaction = true;
    fn();
    if (currentStoreState != this._state) {
      this._notify()
    }
    this._isTransaction = false;

    if (process.env.NODE_ENV != 'production') {
      if (this._debug) {
        console.groupEnd && console.groupEnd();
      }
    }
  }

  _mapActor(msg: string, params: any) {
    let _state = this._state;

    if (process.env.NODE_ENV != 'production') {
      //trace log
      this.debug(() => {
        console.groupCollapsed && console.groupCollapsed(
          `store dispatch msg |> ${JSON.stringify(msg)}`
        );
        console.log(`params |> ${JSON.stringify(params || 'no params')}`)
      });
    }

    for (let i = 0, len = this._actors.length; i < len; i++) {
      const actor = this._actors[i]
      const fn = (actor._route || {})[msg]

      //如果actor没有能力处理该msg跳过
      if (!fn) {
        //log
        if (process.env.NODE_ENV != 'production') {
          if (this._debug) {
            console.log(`${actor.constructor.name} receive '${msg}', but no handle 😭`)
          }
        }
        continue;
      }

      //debug
      if (process.env.NODE_ENV != 'production') {
        if (this._debug) {
          const actorName = actor.constructor.name
          console.log(`${actorName} receive => '${msg}'`)
        }
      }

      let preActorState = this._actorStateList[i];
      const newActorState = actor.receive(msg, preActorState, params)
      if (preActorState != newActorState) {
        this._actorStateList[i] = newActorState;
        _state = _state.merge(newActorState);
      }
    }

    //debug
    if (process.env.NODE_ENV != 'production') {
      if (this._debug) {
        console.groupEnd && console.groupEnd();
      }
    }

    return _state
  }


  _notify() {
    batchedUpdates(() => {
      //通知ui去re-render
      this._callbacks.forEach(cb => cb(this._state));
    })
  }

  /**
   * 批量dispatch，适用于合并一些小计算量的多个dispatch
   * e.g:
   *  this.batchDispatch([
   *    ['loading', true],
   *    ['init', {id: 1, name: 'test'}],
   *    {type: 'ADD_TO_DO', id: 1, text: 'hello todo', done: false}
   *  ]);
   *
   */
  batchDispatch(actions: Array<[string, any] | { type: string }> = []): void {
    //校验参数是否为空
    if (arguments.length == 0) {
      throw new Error('😭 invalid batch dispatch without arguments');
    }

    this.transaction(() => {
      for (let action of actions) {
        const { msg, param } = _parseArgs(action);
        this.dispatch(msg, param)
      }
    });

    /**
     * 解析参数
     * 不加具体参数，发现flow仅支持typeof的类型判断
     */
    function _parseArgs(action: any): ArgResult {
      const res: ArgResult = { msg: '', param: null };

      if (isStr(action)) {
        res.msg = action;
      } else if (isArray(action)) {
        res.msg = action[0];
        res.param = action[1];
      } else if (isObject(action)) {
        const { type, ...rest } = action;
        if (!type) {
          throw new Error('😭 msg should include `type` field.');
        }
        res.msg = type;
        res.param = rest;
      }

      return res;
    }
  }

  /**
   * 计算query-lang的值
   * @param ql
   * @returns {*}
   */
  bigQuery(ql: QueryLang): any {
    //校验query-lang
    if (!ql.isValidQuery()) {
      throw new Error('Invalid query lang');
    }

    const id = ql.id();
    const name = ql.name();
    let metaData = {} as { deps: any, result: any };

    if (process.env.NODE_ENV != 'production') {
      //trace log
      this.debug(() => {
        console.time(`${name}`);
        console.groupCollapsed && console.groupCollapsed(`ql#${name} big query ==>`);
      });
    }

    //当前的QL是不是已经查询过
    //如果没有查询过构建查询meta data
    if (!this._cacheQL[id]) {
      if (process.env.NODE_ENV != 'production') {
        //trace log
        this.debug(() => {
          console.log(`:( not exist in cache`);
        });
      }

      this._cacheQL[id] = {
        result: 0,
        deps: []
      };
    }

    metaData = this._cacheQL[id];

    //不改变参数,拒绝side-effect
    const qlCopy = ql.lang().slice();
    //获取最后的function
    const fn = qlCopy.pop();
    //逐个分析bigquery的path是否存在过期的数据
    let expired = false;

    const args = qlCopy.map((path: any, key: number) => {
      //如果当前的参数仍然是query-lang,则直接递归计算一次query—lang的值
      if (path instanceof QueryLang) {
        const result = this.bigQuery(path);

        //数据有变化
        if (result != metaData.deps[key]) {
          metaData.deps[key] = result;
          expired = true;

          if (process.env.NODE_ENV != 'production') {
            //trace log
            this.debug(() => {
              console.log(`:( deps:ql#${path.name()} data was expired.`);
            });
          }
        }

        if (process.env.NODE_ENV != 'production') {
          this.debug(() => {
            console.log(`:) deps:ql#${path.name()} get result from cache`);
          });
        }

        return result;
      }

      //直接返回当前path下面的状态值
      //如果当前的参数是数组使用immutable的getIn
      //如果当前的参数是一个字符串使用get方式
      const value = isArray(path) ? this._state.getIn(path) : this._state.get(path)

      //不匹配
      if (value != metaData.deps[key]) {
        metaData.deps[key] = value;
        expired = true;

        if (process.env.NODE_ENV != 'production') {
          this.debug(() => {
            console.log(`:( deps: ${JSON.stringify(path)} data had expired.`);
          });
        }
      } else if (typeof (value) === 'undefined' && typeof (metaData.deps[key]) === 'undefined') {
        expired = true;

        if (process.env.NODE_ENV != 'production') {
          this.debug(() => {
            console.log(`:( deps: ${JSON.stringify(path)} undefined. Be careful!`);
          });
        }
      }


      return value;
    });

    //返回数据,默认缓存数据
    let result = metaData.result;

    //如果过期，重新计算
    if (expired) {
      result = fn.apply(null, args);
      metaData.result = result;
    } else {
      if (process.env.NODE_ENV != 'production') {
        this.debug(() => {
          console.log(`:) get result from cache`);
        });
      }
    }

    if (process.env.NODE_ENV != 'production') {
      //trace log
      this.debug(() => {
        const result = (
          (metaData.result && metaData.result.toJS)
            ? metaData.result.toJS()
            : metaData.result
        );
        console.log('!!result => ' + JSON.stringify(result, null, 2));
        console.groupEnd && console.groupEnd();
        console.timeEnd(`${name}`);
      });
    }

    return result;
  }


  /**
   * 当前的状态
   * @returns {Object}
   */
  state() {
    return this._state;
  }

  /**
   * 订阅state的变化
   * @param callback
   * @param isStoreProvider
   */
  subscribe(callback: Callback) {
    if (!isFn(callback)) {
      return;
    }

    if (this._callbacks.indexOf(callback) == -1) {
      this._callbacks.push(callback);
    }
  }

  /**
   * 取消订阅State的变化
   * @param callback
   */
  unsubscribe(callback: Callback) {
    if (!isFn(callback)) {
      return;
    }

    const index = this._callbacks.indexOf(callback);
    if (index != -1) {
      this._callbacks.splice(index, 1);
    }
  }

  //;;;;;;;;;;;;;;;;;;;;;;helper method;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
  /**
   * 替代if
   */
  debug(callback: Function): void {
    if (this._debug) {
      callback();
    }
  }

  /**
   * 格式化当前的状态
   */
  pprint(): void {
    Store.prettyPrint(this.state());
  }

  /**
   * 内部状态
   */
  pprintActor(): void {
    Store.prettyPrint(this._actorStateList)
  }

  /**
   * 漂亮的格式化
   * @param obj
   */
  static prettyPrint(obj: Object): void {
    console.log(JSON.stringify(obj, null, 2));
  }
}

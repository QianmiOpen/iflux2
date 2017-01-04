/**
 * iflux的状态容器中心(MapReduce)
 * 聚合actor, 分派action, 计算query-lang
 *
 * @flow
 */

'use strict';

import {fromJS, OrderedMap} from 'immutable';
import Cursor from 'immutable/contrib/cursor';
import {unstable_batchedUpdates as batchedUpdates} from 'react-dom';

import {isArray, filterActorConflictKey, isFn, isStr, isObject} from './util';
import {QueryLang} from './ql';

import type {StoreOptions, IState} from './types'

type Callback = (state: IState) => void;

type Actor = {
  _route: Object;
  defaultState: () => Object;
  receive: (msg: string, state: IState, params?: any) => IState;
};

type QL = {
  id: () => number;
  name: () => string;
  lang: () => Object;
  isValidQuery(ql: QL): boolean;
};

type ArgResult = {
  msg: string,
  param?: any
};

//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;Store;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
export default class Store {
  //storeprovider订阅者
  _storeProviderSubscribe: ?Function;
  //状态变化的事件通知
  _callbacks: Array<Callback>;
  //当前的actor
  _actors: {[name: string|number]: Actor};
  //actor聚合的状态
  _actorState: OrderedMap<string, any>;
  //当前的对外暴露的状态
  _state: IState & {[name: string]: any};
  //当前的状态
  _debug: boolean;
  //缓存QL的计算结果
  _cacheQL: Object;

  /**
   * map Actor
   */
  _mapActor(cursor: Object, msg: string, param: any): void {
    //trace log
    this.debug(() => {
      console.groupCollapsed(
        `store dispatch {msg =>${JSON.stringify(msg)}}}`
      );
      console.log('param ->');
      console.log((param && param.toJS) ? param.toJS() : param);
      console.time('dispatch');
    });

    //dispatch => every actor
    for (let name in this._actors) {
      if (this._actors.hasOwnProperty(name)) {
        const actor = this._actors[name];
        const state = this._actorState.get(name);

        //trace log
        this.debug(() => {
          const _route = actor._route || {};
          const handlerName = _route[msg] ? _route[msg].name : 'default handler(no match)';
          console.log(`${name} handle => ${handlerName}`);
          console.time(`${name}`);
        });

        const newState = actor.receive(msg, state, param);

        this.debug(() => {
          console.timeEnd(`${name}`);
        });

        // 更新变化的actor的状态
        if (newState != state) {
          cursor.set(name, newState);
        }
      }
    }
  }

  /**
   * 初始化store
   * @param opts
   */
  constructor(opts: StoreOptions = {debug: false}) {
    this._debug = opts.debug;
    this._cacheQL = {};
    this._callbacks = [];
    this._actors = {};
    this._actorState = new OrderedMap();
    this._storeProviderSubscribe = null;

    //聚合actor
    this.reduceActor(this.bindActor());
    //聚合状态
    this._state = this.reduceState();
  }

  /**
   * 绑定Actor
   * @returns {Array}
   */
  bindActor(): Array<Actor> {
    return [];
  }


  /**
   * 聚合actor的defaultState到一个对象中去
   * @params actorList
   */
  reduceActor(actorList: Array<Actor>) {
    const state = {};

    for (let i = 0, len = actorList.length; i < len; i++) {
      const actor = actorList[i];
      const key = this._debug ? actor.constructor.name : i;
      this._actors[key] = actor;
      state[key] = actor.defaultState();
    }

    this._actorState = fromJS(state);

    //计算有没有冲突的key
    this.debug(() => {
      const conflictList = filterActorConflictKey(actorList);
      conflictList.forEach(v => {
        console.warn(`actor:key ‘${v[0]}’ was conflicted among ‘${v[1]}’ `);
      })
    });
  }

  /**
   * 响应view层的事件,将业务分发到所有的actor
   * @param msg
   * @param param
   */
  dispatch(action: string | {type: string}, extra?: any): void {
    //校验参数是否为空
    if (!action) {
      throw new Error('😭 invalid dispatch without arguments');
    }
    const {msg, param} = _parseArgs(action, extra);
    this.cursor().withMutations(cursor => {
      this._mapActor(cursor, msg, param);
    });

    /**
     * 解析参数
     */
    function _parseArgs(
      action: any,
      extra?: any
    ): ArgResult {
      //init
      let res: ArgResult = {msg: '', param: null};
      //兼容Redux单值对象的数据格式
      //e.g: {type: 'ADD_TO_DO', id: 1, text: 'hello iflux2', done: false}
      if (isObject(action)) {
        const {type, ...rest} = action;
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
  batchDispatch(actions: Array<[string, any] | {type: string}> = []): void {
    //校验参数是否为空
    if (arguments.length == 0) {
      throw new Error('😭 invalid batch dispatch without arguments');
    }

    this.cursor().withMutations(cursor => {
      for (let action of actions) {
        const {msg, param} = _parseArgs(action);
        this._mapActor(cursor, msg, param);
      }
    });

    /**
     * 解析参数
     * 不加具体参数，发现flow仅支持typeof的类型判断
     */
    function _parseArgs(action: any): ArgResult {
      const res: ArgResult = {msg: '', param: null};

      if (isStr(action)) {
        res.msg = action;
      } else if (isArray(action)) {
        res.msg = action[0];
        res.param = action[1];
      } else if (isObject(action)) {
        const {type, ...rest} = action;
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
   * 获取当前的cursor
   */
  cursor(): Cursor {
    return Cursor.from(this._actorState, (nextState, state) => {
      //warning
      if (state != this._actorState) {
        console.warn && console.warn('attempted to alter expired state');
      }

      //如果没有数据状态的更新
      if (nextState === state) {
        return;
      }

      this._actorState = nextState;
      //从新计算一次最新的state状态
      this._state = this.reduceState();

      batchedUpdates(() => {

        //先通知storeProvider做刷新
        this._storeProviderSubscribe && this._storeProviderSubscribe(
          () => {
            //end log
            this.debug(() => {
              console.timeEnd('dispatch');
              console.groupEnd && console.groupEnd();
            });
        });

        //通知relax
        this._callbacks.forEach((callback) => {
          callback(this._state);
        });
      });
    });
  }

  /**
   * 计算query-lang的值
   * @param ql
   * @returns {*}
   */
  bigQuery(ql: QL): any {
    //校验query-lang
    if (!ql.isValidQuery(ql)) {
      throw new Error('Invalid query lang');
    }

    const id = ql.id();
    const name = ql.name();
    let metaData = {};

    //trace log
    this.debug(() => {
      console.time(`${name}`);
      console.groupCollapsed(`ql#${name} big query ==>`);
    });

    //当前的QL是不是已经查询过
    //如果没有查询过构建查询meta data
    if (!this._cacheQL[id]) {
      //trace log
      this.debug(() => {
        console.log(`:( not exist in cache`);
      });

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

          //trace log
          this.debug(() => {
            console.log(`:( deps:ql#${path.name()} data was expired.`);
          });
        }

        this.debug(() => {
          console.log(`:) deps:ql#${path.name()} get result from cache`);
        });

        return result;
      }

      //直接返回当前path下面的状态值
      //如果当前的参数是数组使用immutable的getIn
      //如果当前的参数是一个字符串使用get方式
      const value = this._state[isArray(path) ? 'getIn' : 'get'](path);

      //不匹配
      if (value != metaData.deps[key]) {
        metaData.deps[key] = value;
        expired = true;

        this.debug(() => {
          console.log(`:( deps: ${JSON.stringify(path)} data had expired.`);
        });
      } else if (typeof (value) === 'undefined' && typeof (metaData.deps[key]) === 'undefined') {
        expired = true;
        this.debug(() => {
          console.log(`:( deps: ${JSON.stringify(path)} undefined. Be careful!`);
        });
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
      this.debug(() => {
        console.log(`:) get result from cache`);
      });
    }

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
   * 从actorState聚合出对外暴露的状态
   */
  reduceState() {
    this._state = this._state || OrderedMap();
    return this._state.update(value => {
      return this._actorState.valueSeq().reduce((init, state) => {
        return init.merge(state);
      }, value);
    });
  }

  /**
   * 订阅state的变化
   * @param callback
   * @param isStoreProvider
   */
  subscribe(callback: Function) {
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
  unsubscribe(callback: Function) {
    if (!isFn(callback)) {
      return;
    }

    const index = this._callbacks.indexOf(callback);
    if (index != -1) {
      this._callbacks.splice(index, 1);
    }
  }

  /**
   * 订阅StoreProvider的回调
   * @param cb
   */
  subscribeStoreProvider(cb: Function): void {
    if (!isFn(cb)) {
      return;
    }

    this._storeProviderSubscribe = cb;
  }

  /**
   * 取消StoreProvider的订阅
   * @param cb
   */
  unsubscribeStoreProvider(cb: Function) {
    if (!isFn(cb)) {
      return;
    }

    this._storeProviderSubscribe = null;
  }

  //;;;;;;;;;;;;;;;;;;;;;;help method;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
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
    Store.prettyPrint(this._actorState)
  }

  /**
   * 格式化ql的查询结果
   * @param ql
   * @param opts
   */
  pprintBigQuery(ql: Object, opts: Object): void {
    Store.prettyPrint(this.bigQuery(ql, opts));
  }

  /**
   * 漂亮的格式化
   * @param obj
   */
  static prettyPrint(obj: Object): void {
    console.log(JSON.stringify(obj, null, 2));
  }
}

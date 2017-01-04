/**
 * iflux的状态容器中心(MapReduce)
 * 聚合actor, 分派action, 计算query-lang
 *
 * 
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require('immutable');

var _cursor = require('immutable/contrib/cursor');

var _cursor2 = _interopRequireDefault(_cursor);

var _reactDom = require('react-dom');

var _util = require('./util');

var _ql = require('./ql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;Store;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
var Store = function () {
  _createClass(Store, [{
    key: '_mapActor',


    /**
     * map Actor
     */

    //当前的状态

    //actor聚合的状态

    //状态变化的事件通知
    value: function _mapActor(cursor, msg, param) {
      var _this = this;

      //trace log
      this.debug(function () {
        console.groupCollapsed('store dispatch {msg =>' + JSON.stringify(msg) + '}}');
        console.log('param ->');
        console.log(param && param.toJS ? param.toJS() : param);
        console.time('dispatch');
      });

      //dispatch => every actor

      var _loop = function _loop(_name) {
        if (_this._actors.hasOwnProperty(_name)) {
          (function () {
            var actor = _this._actors[_name];
            var state = _this._actorState.get(_name);

            //trace log
            _this.debug(function () {
              var _route = actor._route || {};
              var handlerName = _route[msg] ? _route[msg].name : 'default handler(no match)';
              console.log(_name + ' handle => ' + handlerName);
              console.time('' + _name);
            });

            var newState = actor.receive(msg, state, param);

            _this.debug(function () {
              console.timeEnd('' + _name);
            });

            // 更新变化的actor的状态
            if (newState != state) {
              cursor.set(_name, newState);
            }
          })();
        }
      };

      for (var _name in this._actors) {
        _loop(_name);
      }
    }

    /**
     * 初始化store
     * @param opts
     */

    //缓存QL的计算结果

    //当前的对外暴露的状态

    //当前的actor

    //storeprovider订阅者

  }]);

  function Store() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { debug: false };

    _classCallCheck(this, Store);

    this._debug = opts.debug;
    this._cacheQL = {};
    this._callbacks = [];
    this._actors = {};
    this._actorState = new _immutable.OrderedMap();
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


  _createClass(Store, [{
    key: 'bindActor',
    value: function bindActor() {
      return [];
    }

    /**
     * 聚合actor的defaultState到一个对象中去
     * @params actorList
     */

  }, {
    key: 'reduceActor',
    value: function reduceActor(actorList) {
      var state = {};

      for (var i = 0, len = actorList.length; i < len; i++) {
        var actor = actorList[i];
        var key = this._debug ? actor.constructor.name : i;
        this._actors[key] = actor;
        state[key] = actor.defaultState();
      }

      this._actorState = (0, _immutable.fromJS)(state);

      //计算有没有冲突的key
      this.debug(function () {
        var conflictList = (0, _util.filterActorConflictKey)(actorList);
        conflictList.forEach(function (v) {
          console.warn('actor:key \u2018' + v[0] + '\u2019 was conflicted among \u2018' + v[1] + '\u2019 ');
        });
      });
    }

    /**
     * 响应view层的事件,将业务分发到所有的actor
     * @param msg
     * @param param
     */

  }, {
    key: 'dispatch',
    value: function dispatch(action, extra) {
      var _this2 = this;

      //校验参数是否为空
      if (!action) {
        throw new Error('😭 invalid dispatch without arguments');
      }

      var _parseArgs2 = _parseArgs(action, extra),
          msg = _parseArgs2.msg,
          param = _parseArgs2.param;

      this.cursor().withMutations(function (cursor) {
        _this2._mapActor(cursor, msg, param);
      });

      /**
       * 解析参数
       */
      function _parseArgs(action, extra) {
        //init
        var res = { msg: '', param: null };
        //兼容Redux单值对象的数据格式
        //e.g: {type: 'ADD_TO_DO', id: 1, text: 'hello iflux2', done: false}
        if ((0, _util.isObject)(action)) {
          var _type = action.type,
              rest = _objectWithoutProperties(action, ['type']);

          if (!_type) {
            throw new Error('😭 msg should include `type` field.');
          }
          res.msg = _type;
          res.param = rest;
        } else if ((0, _util.isStr)(action)) {
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

  }, {
    key: 'batchDispatch',
    value: function batchDispatch() {
      var _this3 = this;

      var actions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      //校验参数是否为空
      if (arguments.length == 0) {
        throw new Error('😭 invalid batch dispatch without arguments');
      }

      this.cursor().withMutations(function (cursor) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var action = _step.value;

            var _parseArgs3 = _parseArgs(action),
                _msg = _parseArgs3.msg,
                _param = _parseArgs3.param;

            _this3._mapActor(cursor, _msg, _param);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      });

      /**
       * 解析参数
       * 不加具体参数，发现flow仅支持typeof的类型判断
       */
      function _parseArgs(action) {
        var res = { msg: '', param: null };

        if ((0, _util.isStr)(action)) {
          res.msg = action;
        } else if ((0, _util.isArray)(action)) {
          res.msg = action[0];
          res.param = action[1];
        } else if ((0, _util.isObject)(action)) {
          var _type2 = action.type,
              rest = _objectWithoutProperties(action, ['type']);

          if (!_type2) {
            throw new Error('😭 msg should include `type` field.');
          }
          res.msg = _type2;
          res.param = rest;
        }

        return res;
      }
    }

    /**
     * 获取当前的cursor
     */

  }, {
    key: 'cursor',
    value: function cursor() {
      var _this4 = this;

      return _cursor2.default.from(this._actorState, function (nextState, state) {
        //warning
        if (state != _this4._actorState) {
          console.warn && console.warn('attempted to alter expired state');
        }

        //如果没有数据状态的更新
        if (nextState === state) {
          return;
        }

        _this4._actorState = nextState;
        //从新计算一次最新的state状态
        _this4._state = _this4.reduceState();

        (0, _reactDom.unstable_batchedUpdates)(function () {

          //先通知storeProvider做刷新
          _this4._storeProviderSubscribe && _this4._storeProviderSubscribe(function () {
            //end log
            _this4.debug(function () {
              console.timeEnd('dispatch');
              console.groupEnd && console.groupEnd();
            });
          });

          //通知relax
          _this4._callbacks.forEach(function (callback) {
            callback(_this4._state);
          });
        });
      });
    }

    /**
     * 计算query-lang的值
     * @param ql
     * @returns {*}
     */

  }, {
    key: 'bigQuery',
    value: function bigQuery(ql) {
      var _this5 = this;

      //校验query-lang
      if (!ql.isValidQuery(ql)) {
        throw new Error('Invalid query lang');
      }

      var id = ql.id();
      var name = ql.name();
      var metaData = {};

      //trace log
      this.debug(function () {
        console.time('' + name);
        console.groupCollapsed('ql#' + name + ' big query ==>');
      });

      //当前的QL是不是已经查询过
      //如果没有查询过构建查询meta data
      if (!this._cacheQL[id]) {
        //trace log
        this.debug(function () {
          console.log(':( not exist in cache');
        });

        this._cacheQL[id] = {
          result: 0,
          deps: []
        };
      }

      metaData = this._cacheQL[id];

      //不改变参数,拒绝side-effect
      var qlCopy = ql.lang().slice();
      //获取最后的function
      var fn = qlCopy.pop();
      //逐个分析bigquery的path是否存在过期的数据
      var expired = false;

      var args = qlCopy.map(function (path, key) {
        //如果当前的参数仍然是query-lang,则直接递归计算一次query—lang的值
        if (path instanceof _ql.QueryLang) {
          var _result = _this5.bigQuery(path);

          //数据有变化
          if (_result != metaData.deps[key]) {
            metaData.deps[key] = _result;
            expired = true;

            //trace log
            _this5.debug(function () {
              console.log(':( deps:ql#' + path.name() + ' data was expired.');
            });
          }

          _this5.debug(function () {
            console.log(':) deps:ql#' + path.name() + ' get result from cache');
          });

          return _result;
        }

        //直接返回当前path下面的状态值
        //如果当前的参数是数组使用immutable的getIn
        //如果当前的参数是一个字符串使用get方式
        var value = _this5._state[(0, _util.isArray)(path) ? 'getIn' : 'get'](path);

        //不匹配
        if (value != metaData.deps[key]) {
          metaData.deps[key] = value;
          expired = true;

          _this5.debug(function () {
            console.log(':( deps: ' + JSON.stringify(path) + ' data had expired.');
          });
        } else if (typeof value === 'undefined' && typeof metaData.deps[key] === 'undefined') {
          expired = true;
          _this5.debug(function () {
            console.log(':( deps: ' + JSON.stringify(path) + ' undefined. Be careful!');
          });
        }

        return value;
      });

      //返回数据,默认缓存数据
      var result = metaData.result;

      //如果过期，重新计算
      if (expired) {
        result = fn.apply(null, args);
        metaData.result = result;
      } else {
        this.debug(function () {
          console.log(':) get result from cache');
        });
      }

      //trace log
      this.debug(function () {
        var result = metaData.result && metaData.result.toJS ? metaData.result.toJS() : metaData.result;
        console.log('!!result => ' + JSON.stringify(result, null, 2));
        console.groupEnd && console.groupEnd();
        console.timeEnd('' + name);
      });

      return result;
    }

    /**
     * 当前的状态
     * @returns {Object}
     */

  }, {
    key: 'state',
    value: function state() {
      return this._state;
    }

    /**
     * 从actorState聚合出对外暴露的状态
     */

  }, {
    key: 'reduceState',
    value: function reduceState() {
      var _this6 = this;

      this._state = this._state || (0, _immutable.OrderedMap)();
      return this._state.update(function (value) {
        return _this6._actorState.valueSeq().reduce(function (init, state) {
          return init.merge(state);
        }, value);
      });
    }

    /**
     * 订阅state的变化
     * @param callback
     * @param isStoreProvider
     */

  }, {
    key: 'subscribe',
    value: function subscribe(callback) {
      if (!(0, _util.isFn)(callback)) {
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

  }, {
    key: 'unsubscribe',
    value: function unsubscribe(callback) {
      if (!(0, _util.isFn)(callback)) {
        return;
      }

      var index = this._callbacks.indexOf(callback);
      if (index != -1) {
        this._callbacks.splice(index, 1);
      }
    }

    /**
     * 订阅StoreProvider的回调
     * @param cb
     */

  }, {
    key: 'subscribeStoreProvider',
    value: function subscribeStoreProvider(cb) {
      if (!(0, _util.isFn)(cb)) {
        return;
      }

      this._storeProviderSubscribe = cb;
    }

    /**
     * 取消StoreProvider的订阅
     * @param cb
     */

  }, {
    key: 'unsubscribeStoreProvider',
    value: function unsubscribeStoreProvider(cb) {
      if (!(0, _util.isFn)(cb)) {
        return;
      }

      this._storeProviderSubscribe = null;
    }

    //;;;;;;;;;;;;;;;;;;;;;;help method;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
    /**
     * 替代if
     */

  }, {
    key: 'debug',
    value: function debug(callback) {
      if (this._debug) {
        callback();
      }
    }

    /**
     * 格式化当前的状态
     */

  }, {
    key: 'pprint',
    value: function pprint() {
      Store.prettyPrint(this.state());
    }

    /**
     * 内部状态
     */

  }, {
    key: 'pprintActor',
    value: function pprintActor() {
      Store.prettyPrint(this._actorState);
    }

    /**
     * 格式化ql的查询结果
     * @param ql
     * @param opts
     */

  }, {
    key: 'pprintBigQuery',
    value: function pprintBigQuery(ql, opts) {
      Store.prettyPrint(this.bigQuery(ql, opts));
    }

    /**
     * 漂亮的格式化
     * @param obj
     */

  }], [{
    key: 'prettyPrint',
    value: function prettyPrint(obj) {
      console.log(JSON.stringify(obj, null, 2));
    }
  }]);

  return Store;
}();

exports.default = Store;
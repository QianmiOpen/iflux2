'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * iflux的状态容器中心(MapReduce)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 聚合actor, 分派action, 计算query-lang
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _immutable = require('immutable');

var _cursor = require('immutable/contrib/cursor');

var _cursor2 = _interopRequireDefault(_cursor);

var _util = require('./util');

var _ql = require('./ql');

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;Store;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;


//;;;;;;;;;;;;;;;;;;define flowtype;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
var Store = function () {
  _createClass(Store, [{
    key: 'bindActor',


    /**
     * 绑定Actor
     * @returns {Array}
     */

    //当前的状态

    //actor聚合的状态

    //状态变化的事件通知
    value: function bindActor() {
      return [];
    }

    /**
     * 初始化store
     *
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
    this._actorState = (0, _immutable.OrderedMap)();

    //聚合actor
    this.reduceActor(this.bindActor());
    //聚合状态
    this._state = this.reduceState();
  }

  /**
   * 聚合actor的defaultState到一个对象中去
   * @params actorList
   */


  _createClass(Store, [{
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
    value: function dispatch(msg) {
      var _this = this;

      var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


      //trace log
      this.debug(function () {
        console.groupCollapsed('store dispatch {msg =>' + JSON.stringify(msg) + '}}');
        console.log('param ->');
        console.log(param && param.toJS ? param.toJS() : param);
        console.time('dispatch');
      });

      //cursor更新最新的状态
      this.cursor().withMutations(function (cursor) {
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

        //dispatch => every actor
        for (var _name in _this._actors) {
          _loop(_name);
        }
      });
    }

    /**
     * 获取当前的cursor
     */

  }, {
    key: 'cursor',
    value: function cursor() {
      var _this2 = this;

      return _cursor2.default.from(this._actorState, function (nextState, state) {
        //warning
        if (state != _this2._actorState) {
          console.warn && console.warn('attempted to alter expired state');
        }

        //如果没有数据状态的更新
        if (nextState === state) {
          return;
        }

        _this2._actorState = nextState;
        //从新计算一次最新的state状态
        _this2._state = _this2.reduceState();

        (0, _reactDom.unstable_batchedUpdates)(function () {
          //先通知storeProvider做刷新
          _this2._storeProviderSubscribe && _this2._storeProviderSubscribe(function () {
            //end log
            _this2.debug(function () {
              console.timeEnd('dispatch');
              console.groupEnd && console.groupEnd();
            });
          });
          _this2._callbacks.forEach(function (callback) {
            callback(_this2._state);
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
      var _this3 = this;

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
          var _result = _this3.bigQuery(path);

          //数据有变化
          if (_result != metaData.deps[key]) {
            metaData.deps[key] = _result;
            expired = true;

            //trace log
            _this3.debug(function () {
              console.log(':( deps:ql#' + path.name() + ' data was expired.');
            });
          }

          _this3.debug(function () {
            console.log(':) deps:ql#' + path.name() + ' get result from cache');
          });

          return _result;
        }

        //直接返回当前path下面的状态值
        //如果当前的参数是数组使用immutable的getIn
        //如果当前的参数是一个字符串使用get方式
        var value = _this3._state[(0, _util.isArray)(path) ? 'getIn' : 'get'](path);

        //不匹配
        if (value != metaData.deps[key]) {
          metaData.deps[key] = value;
          expired = true;

          _this3.debug(function () {
            console.log(':( deps: ' + JSON.stringify(path) + ' data had expired.');
          });
        } else if (typeof value === 'undefined' && typeof metaData.deps[key] === 'undefined') {
          expired = true;
          _this3.debug(function () {
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
      var _this4 = this;

      return (0, _immutable.OrderedMap)().update(function (value) {
        return _this4._actorState.valueSeq().reduce(function (init, state) {
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
      var isStoreProvider = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (!callback) {
        return;
      }

      //特别保存storeprovider的订阅者
      if (isStoreProvider) {
        this._storeProviderSubscribe = callback;
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
      if (!callback) {
        return;
      }

      var index = this._callbacks.indexOf(callback);
      if (index != -1) {
        this._callbacks.splice(index, 1);
      }
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
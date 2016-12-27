/**
 * Actor，致敬Erlang，Scala的akka的Actor model
 * Actor, 独立计算的执行单元
 * 我们不共享状态(share state), 只去transform state
 *
 * 
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Actor = function () {
  function Actor() {
    _classCallCheck(this, Actor);
  }

  _createClass(Actor, [{
    key: 'defaultState',


    /**
     * 定义actor的默认状态
     * @returns {{}}
     */
    value: function defaultState() {
      return {};
    }

    /**
     * actor的mode的receive,被store在dispatch的时候调用
     * @param msg
     * @param state
     * @param param
     * @returns {Object}
     */

    //记录当前的路由信息

  }, {
    key: 'receive',
    value: function receive(msg, state, param) {
      //this._route是在@Action标记中初始化完成
      var route = this._route || {};
      //获取处理的函数
      var handler = route[msg];

      //如果可以处理返回处理后的结果，否则直接返回state
      return handler ? handler.call(this, state, param) : state;
    }
  }]);

  return Actor;
}();

exports.default = Actor;
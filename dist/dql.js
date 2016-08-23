'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DQL = exports.DynamicQueryLang = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ql = require('./ql');

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 动态的QueryLang
 * 
 */

var DynamicQueryLang = exports.DynamicQueryLang = function () {
  function DynamicQueryLang(name, lang) {
    _classCallCheck(this, DynamicQueryLang);

    this._ctx = {};
    this._ql = (0, _ql.QL)(name, lang);
  }

  /**
   * 分析路径中的动态元素，然后根据上下文替换
   *
   * @param  {Array<Object>} lang
   */


  _createClass(DynamicQueryLang, [{
    key: 'analyserLang',
    value: function analyserLang(ql) {
      //校验query的合法性
      if (!ql.isValidQuery()) {
        throw new Error('DQL invalid partial query-lang');
      }

      //获取语法结构
      var lang = ql.lang();
      for (var i = 0, len = lang.length - 1; i < len; i++) {
        //获取当前的路径
        var path = lang[i];
        if ((0, _util.isStr)(path) && path[0] === '$') {
          //重新赋值
          lang[i] = this._ctx[path.substring(1)];
        } else if ((0, _util.isArray)(path)) {
          for (var j = 0, _len = path.length; j < _len; j++) {
            var _path = lang[i][j];
            if ((0, _util.isStr)(_path) && _path[0] === '$') {
              //重新赋值
              lang[i][j] = this._ctx[_path.substring(1)];
            }
          }
        } else if (path instanceof DynamicQueryLang) {
          //递归一次
          this.analyserLang(path._ql);
          lang[i] = path._ql;
        }
      }
    }

    /**
     * 返回可用的query lang
     */

  }, {
    key: 'ql',
    value: function ql() {
      this.analyserLang(this._ql);
      return this._ql;
    }

    /**
     * 设置上下文
     * @param  {Object} ctx
     */

  }, {
    key: 'context',
    value: function context(ctx) {
      this._ctx = ctx;
      return this;
    }
  }]);

  return DynamicQueryLang;
}();

/**
 * 工厂函数
 * @param  {string|Array<Object>} name
 * @param  {Array<Object>} lang
 */


var DQL = exports.DQL = function DQL(name, lang) {
  return new DynamicQueryLang(name, lang);
};
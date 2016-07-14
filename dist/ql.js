'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QL = exports.QueryLang = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 查询语言
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//递增的id
var incrementId = 0;

var QueryLang = exports.QueryLang = function () {
  function QueryLang(name, lang) {
    _classCallCheck(this, QueryLang);

    this._id = ++incrementId;

    //如果第一个参数为字符串，改字符串就代表了该QL的name
    //该name就是为了更好的帮助我们debug调试问题
    if (typeof name === 'string' || (0, _util.isStr)(name)) {
      this._name = name;
      this._lang = lang;
    } else {
      this._name = '';
      this._lang = name;
    }
  }

  /**
   * 判断当前是不是一个合法的query lang
   * @returns {boolean}
   */


  _createClass(QueryLang, [{
    key: 'isValidQuery',
    value: function isValidQuery() {
      return (0, _util.isQuery)(this._lang);
    }

    /**
     * 当前的id
     * @returns {number}
     */

  }, {
    key: 'id',
    value: function id() {
      return this._id;
    }

    /**
     * 当前的name
     */

  }, {
    key: 'name',
    value: function name() {
      return this._name || this._id;
    }

    /**
     * 当前的语法标记
     * @returns {Array.<Object>}
     */

  }, {
    key: 'lang',
    value: function lang() {
      return this._lang;
    }
  }]);

  return QueryLang;
}();

//Factory Method


var QL = exports.QL = function QL(name, lang) {
  return new QueryLang(name, lang);
};
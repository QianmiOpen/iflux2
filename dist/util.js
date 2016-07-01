'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isQuery = isQuery;
exports.isArray = isArray;
exports.isFn = isFn;
exports.isStr = isStr;
exports.type = type;
/**
 * 判断当前的参数是不是query-lang的合法形式
 * @param ql
 * @returns {boolean}
 * 
 */
function isQuery(ql) {
  return isArray(ql) && isFn(ql[ql.length - 1]);
}

/**
 * 判断当前的参数是不是数组
 * @param arr
 * @returns {boolean}
 */
function isArray(arr) {
  return type(arr) === '[object Array]';
}

/**
 * 是不是函数
 * @param fn
 * @returns {boolean}
 */
function isFn(fn) {
  return type(fn) === '[object Function]';
}

/**
 * 是不是字符串
 * @param str
 */
function isStr(str) {
  return type(str) === '[object String]';
}

/**
 * 判断数据类型
 * @param type
 * @returns {string}
 */
function type(type) {
  return Object.prototype.toString.call(type);
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isQuery = isQuery;
exports.isArray = isArray;
exports.isFn = isFn;
exports.isStr = isStr;
exports.type = type;
exports.filterActorConflictKey = filterActorConflictKey;
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

function filterActorConflictKey() {
  var actor = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

  //如果数组的元素只有一个不判断
  if (actor.length <= 1) {
    return;
  }

  //聚合数据
  var actorKeyMap = {};

  var _loop = function _loop(i, len) {
    var actorName = actor[i].constructor.name;
    Object.keys(actor[i].defaultState()).forEach(function (v) {
      (actorKeyMap[v] || (actorKeyMap[v] = [])).push(actorName);
    });
  };

  for (var i = 0, len = actor.length; i < len; i++) {
    _loop(i, len);
  }

  //计算冲突的可以
  var conflictKeyList = [];
  Object.keys(actorKeyMap).forEach(function (v) {
    var value = actorKeyMap[v];
    if (value.length > 1) {
      conflictKeyList.push([v, value]);
    }
  });

  return conflictKeyList;
}
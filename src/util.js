/**
 * 判断当前的参数是不是query-lang的合法形式
 * @param ql
 * @returns {boolean}
 * @flow
 */
export function isQuery(ql: any){
  return isArray(ql) && isFn(ql[ql.length -1]);
}


/**
 * 判断当前的参数是不是数组
 * @param arr
 * @returns {boolean}
 */
export function isArray(arr: any) {
  return type(arr) === '[object Array]';
}

/**
 * 是不是函数
 * @param fn
 * @returns {boolean}
 */
export function isFn(fn: any) {
  return type(fn) === '[object Function]';
}

/**
 * 是不是字符串
 * @param str
 */
export function isStr(str: any) {
  return type(str) === '[object String]';
}


/**
 * 判断数据类型
 * @param type
 * @returns {string}
 */
export function type(type: any) {
  return Object.prototype.toString.call(type);
}

/**
 * 判断当前的参数是不是query-lang的合法形式
 * @param ql
 * @returns {boolean}
 * @flow
 */

'use strict';


/**
 * 判断当前的参数是不是数组
 * @param arr
 * @returns {boolean}
 */
export function isArray(arr: any): boolean {
  return type(arr) === '[object Array]';
}

/**
 * 是不是函数
 * @param fn
 * @returns {boolean}
 */
export function isFn(fn: any): boolean {
  return type(fn) === '[object Function]';
}

/**
 * 是不是字符串
 * @param str
 */
export function isStr(str: any): boolean {
  return type(str) === '[object String]';
}

export function isObject(str: any): boolean {
  return type(str) === '[object Object]';
}

/**
 * 判断数据类型
 * @param type
 * @returns {string}
 */
export function type(type: any): string {
  return Object.prototype.toString.call(type);
}

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Action decorator
 *
 * 用于标记Actor中的实力方法，主要的作用是给Actor绑定当前的handler方法
 * 便于Actor的receive方法可以搜索到哪个handler可以处理dispatch过来的事件
 * 
 * @param msg 事件名称
 * 
 */
var Action = exports.Action = function Action(msg) {
  return function (target, props, descriptor) {
    target._route = target._route || {};
    target._route[msg] = descriptor.value;
  };
};
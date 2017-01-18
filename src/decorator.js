/**
 *
 * @flow
 */

'use strict';

import React from 'react';

/**
 * Action decorator
 *
 * 用于标记Actor中的实力方法，主要的作用是给Actor绑定当前的handler方法
 * 便于Actor的receive方法可以搜索到哪个handler可以处理dispatch过来的事件
 *
 * Usage:
 * import {Actor, Action} from 'iflux2'
 *
 * class HelloActor extends Actor {
 *   defaultState() {
 *    return {text: 'hello iflxu2'}
 *   }
 *
 *   @Action('change')
 *   change(state, text) {
 *    return state.set('text', text);
 *   }
 *
 * }
 *
 *
 * @param msg 事件名称
 * @constructor
 */
export const Action = (msg: string) => (
  target: any,
  props: any,
  descriptor: Object
) => {
  target._route = target._route || {};
  target._route[msg] = descriptor.value;
};


/**
 * 动态的绑定组件的上下文
 *
 * Usage
 * import React, {Component} from 'iflux2'
 *
 * @CtxStoreName('_store')
 * class Hello extends Component {
 *   render() {
 *    return <div>hello world</div>
 *   }
 * }
 * @param obj 绑定上下文
 * @returns {function(Object)}
 */
export const CtxStoreName = (name: string) => {
  return (target: Object) => {
    //动态的在组件的上下午绑定storeName
    //通过该标记反向的告诉Relax获取正取的上下文store
    target._ctxStoreName = name;
  };
};

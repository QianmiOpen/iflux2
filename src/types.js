//@flow
import {Map} from 'immutable'

/**
 * Store的构造函数的类型参数
 */
export type StoreOptions = {
  debug?: boolean;
  ctxStoreName?: string;
};

//不可变的状态类型
export type IState = Map<string, any>;

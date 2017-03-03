/**
 * 查询语言
 * @flow
 */

'use strict';

import { isQuery } from './util';

type Lang = Array<any>;

//递增的id
let uuid = 0;

export class QueryLang {
  _id: number;
  _lang: Lang;
  _name: string;

  /**
   * init
   */
  constructor(name: string, lang: Lang) {
    this._id = ++uuid;
    this._name = name;
    this._lang = lang;

    if (process.env.NODE_ENV != 'production') {
      if (!isQuery(this._lang)) {
        throw new Error(`${this._name} is not invalid`)
      }
    }
  }

  /**
   * 判断当前是不是一个合法的query lang
   * @returns {boolean}
   */
  isValidQuery(): boolean {
    return isQuery(this._lang);
  }

  /**
   * 当前的id
   * @returns {number}
   */
  id(): number {
    return this._id;
  }

  /**
   * 当前的name
   */
  name(): string {
    return this._name;
  }

  /**
   * 当前的语法标记
   * @returns {Array.<Object>}
   */
  lang() {
    return this._lang;
  }

  setLang(lang: Lang) {
    this._lang = lang;
    return this;
  }
}

//export factory method
export const QL = (
  name: string,
  lang: Lang
) => new QueryLang(name, lang);

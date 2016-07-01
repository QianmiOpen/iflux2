/**
 * 查询语言
 * @flow
 */
import {isQuery, isStr} from './util';


//递增的id
let incrementId = 0;


export class QueryLang {
  _id: number;
  _lang: Array<Object>;
  _name: string|Array<Object>;


  constructor(name: string|Array<Object>, lang: Array<Object>) {
    this._id = ++incrementId;

    //如果第一个参数为字符串，改字符串就代表了该QL的name
    //该name就是为了更好的帮助我们debug调试问题
    if (typeof(name) === 'string' || isStr(name)) {
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
  isValidQuery() {
    return isQuery(this._lang);
  }


  /**
   * 当前的id
   * @returns {number}
   */
  id() {
    return this._id;
  }


  /**
   * 当前的name
   */
  name() {
    return this._name || this._id;
  }


  /**
   * 当前的语法标记
   * @returns {Array.<Object>}
   */
  lang() {
    return this._lang;
  }
}


//Factory Method
export const QL = (name: string|Array<Object>, lang:Array<Object>) => new QueryLang(name, lang);

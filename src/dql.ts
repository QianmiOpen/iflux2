
import { QueryLang } from './ql';
import { isArray, isStr, isQuery } from './util';

type Lang = Array<any>;

/**
 * 动态的QueryLang
 */
export class DynamicQueryLang {
  _ctx: Object;
  _name: string;
  _lang: Lang;

  constructor(name: string, lang: Lang) {
    this._ctx = {};
    this._name = name;
    this._lang = lang;

    if (process.env.NODE_ENV != 'production') {
      if (!isQuery(this._lang)) {
        throw new Error(`${this._name} syntax error`)
      }
    }
  }

  /**
   * 分析路径中的动态元素，然后根据上下文替换
   * @param ql
   */
  analyserLang(dLang: Lang) {
    const lang = []

    for (let i = 0, len = dLang.length; i < len; i++) {
      //获取当前的路径
      let path = dLang[i];

      if (isStr(path) && path[0] === '$') {
        lang[i] = path[0] === '$' ? this._ctx[path.substring(1)] : path;
      } else if (isArray(path)) {
        //init
        lang[i] = []
        for (let j = 0, len = path.length; j < len; j++) {
          let field = dLang[i][j];
          lang[i][j] = isStr(field) && field[0] === '$' ? this._ctx[field.substring(1)] : field;
        }
      } else if (path instanceof DynamicQueryLang) {
        lang[i] = new QueryLang(path._name + '2QL', this.analyserLang(path._lang));
      } else {
        //zero runtime cost
        if (process.env.NODE_ENV != 'production') {
          //如果path是QueryLang，校验querylang语法的合法性
          if (path instanceof QueryLang && !path.isValidQuery()) {
            throw new Error(`DQL: syntax error`);
          }
        }
        lang[i] = path;
      }
    }


    return lang;
  }

  /**
   * 设置上下文
   * @param  {Object} ctx
   */
  context(ctx: Object) {
    this._ctx = ctx;
    return this;
  }

  name() {
    return this._name
  }

  lang() {
    return this._lang
  }
}

/**
 * 工厂函数
 * @param  {string name
 * @param  {Lang} lang
 */
export const DQL = (
  name: string,
  lang: Lang
) => new DynamicQueryLang(name, lang);

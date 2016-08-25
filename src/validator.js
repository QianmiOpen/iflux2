/**
 * Validator
 *
 * 封装常用的校验工具方法
 */
export default class Validator {

  /**
   * 验证
   * @param obj
   * @param rules
   * @param opts
   */
  static validate(obj, rules, options) {
    //保存错误信息
    let result = {result: true, errors: {}};
    //获取配置参数
    const opts = Object.assign({}, {
      oneError: false,
      debug: false,
      validateFields: []
    }, options);

    let validateFields = opts.validateFields;
    let validateRules = {};

    //如果有自定义校验的字段，只校验自定义的字段
    //如果没有，则全部校验
    if (validateFields.length) {
      validateFields.reduce((init, field) => {
        if (rules[field]) {
          init[field] = rules[field];
        }
        return init;
      }, validateRules);
    } else {
      validateRules = rules;
    }

    for (let field in validateRules) {
      if (rules.hasOwnProperty(field)) {
        /**
         * 获取规则对象, 例如:
         * {
         *   userName: {
         *   required: true,
         *   email: true,
         *   message: {
         *    required: '用户名必填',
         *    email: '邮箱'
         *   }}
         * }
         */
        const ruleMap = rules[field];
        //将要校验的值
        const value = obj[field];
        //校验的信息
        const message = rules[field]['message'] || {};
        //错误集合
        let errors = [];

        if (opts.debug) {
          console.groupCollapsed(`validate '${field}'`)
        }

        for (let rule in ruleMap) {
          if (ruleMap.hasOwnProperty(rule) && rule != 'message') {
            //获取当前的校验规则
            const ruleValue = ruleMap[rule];
            //封装传递给校验函数的参数
            const args = [];

            //如果规则的值为布尔类型且为false,跳过校验
            if (typeof(ruleValue) === 'boolean' && ruleValue === false) {
              continue;
            } else if (typeof(ruleValue) === 'boolean') {
              args.push(value)
            } else {
              args.push(ruleValue);
              args.push(value);
            }

            const validateMethod = Validator[rule];
            //如果validateMethod不存在，给出警告
            if (!validateMethod) {
              console.warn && console.warn(`can not find '${rule}' rule in '${field}'`);
              continue;
            }

            if (opts.debug) {
              console.log && console.log(
                `validator rule => '${rule}, ruleValue => '${ruleValue}'`
              )
            }

            //没有通过校验
            if (!validateMethod.apply(null, args)) {
              if (opts.debug) {
                console.log('result: failed')
              }
              errors.push(message[rule]);
              //如果开启一个错误
              if (opts.oneError) {
                break;
              }
            } else {
              if (opts.debug) {
                console.log('result: ok')
              }
            }
          }
        }

        if (opts.debug) {
          console.groupEnd && console.groupEnd();
        }

        if (errors.length != 0) {
          result.result = false;
          result.errors[field] = errors;

          //如果开启oneError，立刻返回错误
          if (opts.oneError) {
            return result;
          }
        }
      }
    }

    return result;
  }

  /**
   * 判断是不是email
   * @param value
   * @returns {boolean}
   */
  static email(value) {

    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
  }


  /**
   * 判断是不是url
   *
   * @param value
   * @returns {boolean|*}
   */
  static url(value) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
  }


  /**
   *  校验是不是日期
   *
   * @param value
   * @returns {boolean}
   */
  static date(value) {
    return !/Invalid|NaN/.test(new Date(value).toString());
  }


  /**
   * 判断是不是数字带小数点
   *
   * @param value
   * @returns {boolean}
   */
  static number(value) {
    return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
  }


  /**
   * 校验是不是数字不带小数点
   *
   * @param value
   * @returns {boolean|*}
   */
  static digits(value) {
    return /^\d+$/.test(value);
  }


  /**
   * 校验必须项
   *
   * @param value
   * @returns {boolean}
   */
  static required(value) {
    return /\w+/.test(value);
  }


  /**
   * 身份证号码
   *
   * @param value
   * @returns {boolean}
   */
  static cardNo(value) {
    var len = value.length, re;
    if (len == 15)
      re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{3})$/);
    else if (len == 18)
      re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\d)$/);
    else {
      return false;
    }
    var a = value.match(re);
    if (a != null) {
      if (len == 15) {
        var D = new Date("19" + a[3] + "/" + a[4] + "/" + a[5]);
        var B = D.getYear() == a[3] && (D.getMonth() + 1) == a[4]
          && D.getDate() == a[5];
      } else {
        var D = new Date(a[3] + "/" + a[4] + "/" + a[5]);
        var B = D.getFullYear() == a[3] && (D.getMonth() + 1) == a[4]
          && D.getDate() == a[5];
      }
      if (!B) {
        return false;
      }
    }
    return true;
  }


  /**
   * qq
   * @param value
   * @returns {boolean|*}
   */
  static qq(value) {
    return /^[1-9][0-9]{4,14}$/.test(value);
  }


  /**
   * 手机号码
   * @param value
   * @returns {boolean}
   */
  static mobile(value) {
    var length = value.length;
    var reg = /^((1)+\d{10})$/;
    return length == 11 && reg.test(value);
  }

  /**
   * 电话号码
   * @param value
   * @returns {boolean|*}
   */
  static phone(value) {
    var reg = /^((\d{10,11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
    return reg.test(value);
  }


  /**
   * 密码强度验证: 密码必须是字符与数字的混合
   *
   * @param value
   * @returns {boolean}
   */
  static pwdMix(value) {
    var reg = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;
    return reg.test(value);
  }


  /**
   * 最小值
   * @param param
   * @param value
   * @returns {boolean}
   */
  static min(param, value) {
    return value >= param;
  }


  /**
   * 最大值
   * @param param
   * @param value
   * @returns {boolean}
   */
  static max(param, value) {
    return value <= param;
  }


  /**
   * 最小长度
   *
   * @param param
   * @param value
   * @returns {boolean}
   */
  static minLength(param, value) {
    return value.length >= param;
  }


  /**
   * 最大长度
   * @param param
   * @param value
   * @returns {boolean}
   */
  static maxLength(param, value) {
    return value.length <= param;
  }


  /**
   * 在范围内
   *
   * @param param
   * @param value
   * @returns {boolean}
   */
  static range(param, value) {
    return value >= param[0] && value <= param[1];
  }


  /**
   * 长度在范围之内
   * @param param
   * @param val
   * @returns {boolean}
   */
  static rangeLength(param, val) {
    return val.length >= param[0] && val.length <= param[1];
  }


  /**
   * 非法字符
   *
   * @param value
   * @returns {boolean}
   */
  static forbbidenChar(value) {
    return /[&\\<>'"]/.test(value);
  }


  /**
   * 邮编
   *
   * @param value
   * @returns {boolean}
   */
  static zipCode(value) {
    return /^[0-9]{6}$/.test(value);
  }


  /**
   * 判断是不是数字最多两位小数
   *
   * @param value
   * @returns {boolean}
   */
  static number(value) {
    return /^[0-9]+(.[0-9]{1,2})?$/.test(value);
  }


  /**
   * 添加自定义校验方法
   * @param name: 校验方法名称
   * @param callback: 校验方法
   */
  static addValidator(name, callback) {
    Validator[name] = callback;
  }
}

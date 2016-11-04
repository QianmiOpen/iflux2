/**
 * 判断当前的参数是不是query-lang的合法形式
 * @param ql
 * @returns {boolean}
 * @flow
 */
export function isQuery(ql: any): boolean {
  return isArray(ql) && isFn(ql[ql.length -1]);
}


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


/**
 * 判断数据类型
 * @param type
 * @returns {string}
 */
export function type(type: any): string {
  return Object.prototype.toString.call(type);
}


/**
 * 过滤出actor中重复的key
 * @param actor
 * @returns Array
 */
export function filterActorConflictKey(actor: Array<Object> = []): Array<Object> {
  //返回冲突的key的数组
  let conflictKeyList = [];

  //如果数组的元素只有一个不判断
  if (actor.length <= 1) {
    return conflictKeyList;
  }

  //聚合数据
  let actorKeyMap = {};
  for (let i = 0, len = actor.length; i < len; i++) {
    const actorName = actor[i].constructor.name;
    Object.keys(actor[i].defaultState()).forEach(v => {
      (actorKeyMap[v] || (actorKeyMap[v] = [])).push(actorName);
    })
  }

  Object.keys(actorKeyMap).forEach(v => {
    const value = actorKeyMap[v];
    if (value.length > 1) {
      conflictKeyList.push([v, value]);
    }
  });

  return conflictKeyList;
}

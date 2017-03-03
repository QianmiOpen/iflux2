
export = Util;

declare namespace Util {
  function isArray(arr: any): boolean;
  function isFn(fn: any): boolean;
  function isStr(str: any): boolean;
  function isObject(obj: any): boolean;
  function type(t: any): string;
}

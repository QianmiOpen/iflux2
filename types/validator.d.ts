export = Validator;

declare class Validator {
  static validate(
    obj: Object,
    rules: Object,
    options: Validator.ValidatorOptions
  ): Validator.ValidatorResult;

  static email(value: string): boolean;
  static url(value: string): boolean;
  static date(value: string): boolean;
  static number(value: string): boolean;
  static digits(value: string): boolean;
  static required(value: string): boolean;
  static cardNo(value: string): boolean;
  static qq(value: string): boolean;
  static mobile(value: string): boolean;
  static zipCode(value: string): boolean;

  static phone(value: string): boolean;
  static pwdMix(value: string): boolean;
  static min(param: number, value: string): boolean;
  static max(param: number, value: string): boolean;
  static minLength(param: number, value: string): boolean;
  static maxLength(param: number, value: string): boolean;
  static range(param: [number, number], value: string): string;

  static rangeLength(param: [number, number], val: string): boolean;
  static forbbidenChar(value: string): boolean;
  static addValidator(name: string, callback: Function): void;
}


declare namespace Validator {
  export interface ValidatorOptions {
    oneError?: boolean;
    debug?: boolean;
    validateFields: Array<string>;
  }

  export interface ValidatorResult {
    result: boolean;
    errors: { [key: string]: Array<string> };
  }
}
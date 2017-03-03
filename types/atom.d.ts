import { Map } from 'immutable'

export = Atom;

declare class Atom {
  constructor(record: Object);
  value(path: string | Array<String>): Atom.IState;
  subscribe(callback: Function): void;
  unsubscribe(callback: Function): void;
}

declare namespace Atom {
  export type IState = Map<string, any>;
}
jest.unmock('../src/util');
jest.unmock('../src/query-lang.js');
import {
  isArray,
  isStr,
  isFn,
} from '../src/util';
import {QL} from '../src/query-lang';


describe('util test suite', () => {
  it('it should be array', () => {
    expect(true).toEqual(
      isArray([1,2,3])
    );

    expect(false).toEqual(
      isArray({})
    );
  });

  it('it should be string', () => {
    expect(true).toEqual(
      isStr('hello')
    );

    expect(false).toEqual(
      isStr(1323)
    );
  });

  it('it should be fn', () => {
    expect(true).toEqual(
      isFn(() => {})
    );

    expect(false).toEqual(
      isFn(123)
    );
  });
});
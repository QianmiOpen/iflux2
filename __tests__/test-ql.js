jest.unmock('../src/query-lang');
jest.unmock('../src/util');

import {QL} from '../src/query-lang';


const testQL = QL([
  ['user'],
  (user) => user
]);


describe('query lang test suite', () => {
  it('it should be query lang', () => {
    expect(true).toEqual(testQL.isValidQuery());
    expect(1).toEqual(testQL.id());
  });
});


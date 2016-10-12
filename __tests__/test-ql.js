import {QL} from '../src/ql';


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


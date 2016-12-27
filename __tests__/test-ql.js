import {QL} from '../src/ql';


//QL的name改为必填项
const testQL = QL('testQL', [
  ['user'],
  (user) => user
]);


describe('query lang test suite', () => {
  it('it should be query lang', () => {
    expect(true).toEqual(testQL.isValidQuery());
    expect(1).toEqual(testQL.id());
  });
});

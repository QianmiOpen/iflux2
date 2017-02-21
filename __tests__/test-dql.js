import { DQL } from '../src/dql'
import { QL, QueryLang } from '../src/ql';


const oneDQL = DQL('oneDQL', [
  '$id',
  (id) => id
])

const testDQL = DQL('testDQL', [
  '$id',
  oneDQL,
  ['user', '$id'],
  (user) => user
]);


describe('dynamic query lang test suite', () => {
  it('it should be ok', () => {
    const lang = testDQL.context({ id: 1 }).analyserLang(testDQL.lang())
    const ql = new QueryLang('testQL', lang);
    expect(1).toEqual(ql.lang()[0]);
    expect(1).toEqual((ql.lang()[1]).lang()[0]);
    expect(['user', 1]).toEqual(ql.lang()[2]);
  });
});

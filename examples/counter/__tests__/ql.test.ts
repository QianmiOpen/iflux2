import Store from '../src/store'
import { countQL } from '../src/ql'

describe('ql', () => {
  it('countQL', () => {
    expect(countQL.isValidQuery()).toEqual(true)

    const store = new Store({})
    expect(store.bigQuery(countQL)).toEqual('QL:0')

    store.increment();
    expect(store.bigQuery(countQL)).toEqual('QL:1');

    store.decrement();
    expect(store.bigQuery(countQL)).toEqual('QL:0');
  });
})

import Store from '../src/store'
import {countQL} from '../src/ql'

describe('ql', () => {
  it('countQL', () => {
    expect(true).toEqual(countQL.isValidQuery());
    const store = new Store()
    expect('QL:0').toEqual(store.bigQuery(countQL));
    
    store.increment();
    expect('QL:1').toEqual(store.bigQuery(countQL));

    store.decrement();
    expect('QL:0').toEqual(store.bigQuery(countQL));
  });
})
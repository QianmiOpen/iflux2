import CounterActor from '../src/actor/counter-actor'
import { fromJS } from 'immutable'

describe('test counter actor', () => {

  it('test default value', () => {
    const counter = new CounterActor
    expect(counter.defaultState()).toEqual({ count: 0 })
  });

  it('test increment', () => {
    const counter = new CounterActor
    const state = fromJS({
      count: 0
    });
    expect(counter.increment(state).toJS()).toEqual({ count: 1 })
  })

  it('test decrement', () => {
    const counter = new CounterActor
    const state = fromJS({
      count: 0
    });
    expect(counter.decrement(state).toJS()).toEqual({ count: -1 })
  })

})

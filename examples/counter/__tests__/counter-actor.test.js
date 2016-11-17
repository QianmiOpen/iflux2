import CounterActor from '../src/actor/counter-actor'
import {fromJS} from 'immutable'

describe('test counter actor', () => {
  
  it('test default value', () => {
    const counter = new CounterActor
    expect({
      count: 0
    }).toEqual(counter.defaultState())
  });

  it('test increment', () => {
    const counter = new CounterActor
    const state = fromJS({
      count: 0
    });
    expect({
      count: 1
    }).toEqual(counter.increment(state).toJS());
  })

  it('test decrement', () => {
    const counter = new CounterActor
    const state = fromJS({
      count: 0
    });
    expect({
      count: -1
    }).toEqual(counter.decrement(state).toJS());
  })

})
import TimerActor from '../src/actor/timer-actor'
import {fromJS} from 'immutable'

describe('test timer actor', () => {
  
  it('test default value', () => {
    const timer = new TimerActor
    expect({
      time: 0
    }).toEqual(timer.defaultState())
  });

  it('test start', () => {
    const timer= new TimerActor
    const state = fromJS({
      time: 0
    });
    expect({
      time: 1
    }).toEqual(timer.increment(state).toJS());
  })

  it('test decrement', () => {
    const timer = new TimerActor
    const state = fromJS({
      time: 10 
    });
    expect({
      time: 0 
    }).toEqual(timer.reset(state).toJS());
  })

})
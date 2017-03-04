import TimerActor from '../src/actor/timer-actor'
import { fromJS } from 'immutable'

describe('test timer actor', () => {

  it('test default value', () => {
    const timer = new TimerActor
    expect(timer.defaultState()).toEqual({ time: 0 })
  });

  it('test start', () => {
    const timer = new TimerActor
    const state = fromJS({
      time: 0
    });
    expect(timer.increment(state).toJS()).toEqual({ time: 1 })
  })

  it('test decrement', () => {
    const timer = new TimerActor
    const state = fromJS({
      time: 10
    });
    expect(timer.reset(state).toJS()).toEqual({ time: 0 })
  })

})
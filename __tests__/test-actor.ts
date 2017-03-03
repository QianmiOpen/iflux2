import { fromJS, is } from 'immutable';
import { Actor, Action } from "../src/index";

describe('default actor', () => {
  it('defaultState is equal {}', () => {
    const defaultActor = new Actor();
    expect(defaultActor.defaultState()).toEqual({});
  });
});


//;;;;;;;;;;;;;;;UserActor;;;;;;;;;;;;;;;;;;;;;;
class UserActor extends Actor {
  defaultState() {
    return {
      id: 1,
      username: 'iflux2',
      age: 1,
      email: 'iflux@qianmi.com'
    };
  }

  @Action('init')
  init(state) {
    return state;
  }

  @Action('_change:age')
  changeAge(state, age) {
    return state.set('age', age);
  }
}

//;;;;;;;;;;;;;;;;;;init;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
const user = new UserActor();

//;;;;;;;;;;;;;;;test;;;;;;;;;;;;;;;;;;;;;
describe('actor test suite', () => {
  it('default state test', () => {
    expect(user.defaultState())
      .toEqual({
        id: 1,
        username: 'iflux2',
        age: 1,
        email: 'iflux@qianmi.com'
      })
  });

  it('decorator test', () => {
    expect(user.init).toEqual(user._route['init']);
  });

  it('receive test', () => {
    const state = fromJS({
      id: 1,
      username: 'iflux2',
      age: 1,
      email: 'iflux@qianmi.com'
    });

    const newState = user.receive('init', state);
    expect(state === newState).toEqual(true);

    //change age test
    expect(user.receive('_change:age', state, 10).get('age')).toEqual(10);
  });
});

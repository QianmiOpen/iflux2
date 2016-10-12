import Actor from '../src/actor';
import {Action} from '../src/decorator';
import {fromJS, is} from 'immutable';


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

//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
const user = new UserActor();


//;;;;;;;;;;;;;;;test;;;;;;;;;;;;;;;;;;;;;
describe('actor test suite', () => {
  it('default state test', () => {
    expect({
      id: 1,
      username: 'iflux2',
      age: 1,
      email: 'iflux@qianmi.com'
    }).toEqual(user.defaultState());
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
    expect(true).toEqual(state === newState);

    //change age test
    expect(10).toEqual(user.receive('_change:age', state, 10).get('age'));
  });
});

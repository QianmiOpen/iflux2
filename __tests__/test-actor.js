jest.unmock('../src/decorator');
import Actor from '../src/actor';
import {Action} from '../src/decorator';
import {fromJS} from 'immutable';


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
}

const user = new UserActor();

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
    expect(true).toEqual(user._route['init'] != null);
  });

  it('receive test', () => {
    const state = fromJS({
      id: 1,
      username: 'iflux2',
      age: 1,
      email: 'iflux@qianmi.com'
    });
    const newState = user.receive(state, 'init');
    expect(true).toEqual(state === newState);
  });
});

jest.unmock('immutable');
jest.unmock('immutable/contrib/cursor');
jest.unmock('../src/util');
jest.unmock('../src/query-lang.js');
jest.unmock('../src/actor');
jest.unmock('../src/store');
jest.unmock('../src/query-lang');
jest.unmock('../src/decorator');

import Store from '../src/store';
import Actor from '../src/actor';
import {QL} from '../src/query-lang';
import {Action} from '../src/decorator';



class LoadingActor extends Actor {
  defaultState() {
    return {
      loading: true
    };
  }
}


class UserActor extends Actor {
  defaultState() {
    return {
      id: 1,
      name: 'iflux'
    }
  }

  @Action('change:name')
  changeName(state, {name}) {
    return state.set('name', name);
  }
}

class AppStore extends Store {
  bindActor() {
    return [
      new LoadingActor,
      new UserActor
    ];
  }
}

const appStore = new AppStore({debug: true});
console.groupCollapsed = console.log;
console.groupEnd = console.log;
console.group = console.log;

const userQL = QL('userQL',[
  ['loading'],
  ['name'],
  (loading, name) => ({loading, name})
]);

const idQL = QL([
  ['id'],
  (id) => id
]);

const idUserQL = QL('idUserQL', [
  idQL,
  userQL, 
  (id, user) => ({id, user})
]);

describe('app store test suite', () => {
  it('state should be equal', () => {
    expect({
      id: 1,
      name: 'iflux',
      loading: true
    }).toEqual(appStore.state().toJS())
  });

  it('bigquery should be equal', () => {
    expect({
      loading: true,
      name: 'iflux'
    }).toEqual(appStore.bigQuery(userQL));

    expect(1).toEqual(appStore.bigQuery(idQL));
  });

  it('nested bigQuery test', () => {
    expect({
      id:1,
      user: {loading: true, name: 'iflux'}
    }).toEqual(appStore.bigQuery(idUserQL));
  });

  it('dispatch', () => {
    appStore.dispatch('change:name', {name: 'iflux2'});
    expect({
      loading: true,
      name: 'iflux2'
    }).toEqual(appStore.bigQuery(userQL));
  });
});

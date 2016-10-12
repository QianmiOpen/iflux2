import Store from '../src/store';
import Actor from '../src/actor';
import {QL} from '../src/ql';
import {Action} from '../src/decorator';
import {DQL} from '../src/dql';
import {fromJS} from 'immutable';



//;;;;;;;;;;;;;;;;;;;;;;Actor;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
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
      name: 'iflux',
    }
  }


  @Action('change:name')
  changeName(state, {name}) {
    return state.set('name', name);
  }
}


class TodoActor extends Actor {
  defaultState() {
    return {
      todo: [
        { id: 1, text: 'hello dql', done: false }
      ]
    }
  }
}


//;;;;;;;;;;;;;;;;;;;;Store;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
class AppStore extends Store {
  bindActor() {
    return [
      new LoadingActor,
      new UserActor,
      new TodoActor
    ];
  }
}

const appStore = new AppStore({ debug: false });
// console.groupCollapsed = console.log;
// console.groupEnd = console.log;
// console.group = console.log;

//;;;;;;;;;;;;;;;;;;;;;;;;;query-lang;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
const userQL = QL('userQL', [
  ['loading'],
  ['name'],
  (loading, name) => ({ loading, name })
]);

const idQL = QL([
  ['id'],
  (id) => id
]);

const idUserQL = QL('idUserQL', [
  idQL,
  userQL,
  (id, user) => ({ id, user })
]);


const idDQL = DQL('todoIdDQL', [
  ['todo', '$index', 'id'],
  (id) => id
]);

const todoDQL = DQL('todoDQL', [
  idDQL,
  ['todo', '$index'],
  (id, todo) => (fromJS({ id, todo }))
]);


function mockSubscribeCallback() {
}


//;;;;;;;;;;;;;;;;;;;;;;test suite;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
describe('app store test suite', () => {
  it('store subscribe', () => {
    //重复添加
    appStore.subscribe(mockSubscribeCallback);
    appStore.subscribe(mockSubscribeCallback);

    expect(1).toEqual(appStore._callbacks.length);
  });

  it('store unsubscribe', () => {
    appStore.unsubscribe(mockSubscribeCallback);
    expect(0).toEqual(appStore._callbacks.length);
  });


  it('state should be equal', () => {
    expect({
      id: 1,
      name: 'iflux',
      loading: true,
      todo: [{ id: 1, text: 'hello dql', done: false }]
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
      id: 1,
      user: { loading: true, name: 'iflux' }
    }).toEqual(appStore.bigQuery(idUserQL));
  });

  it('dispatch', () => {
    appStore.dispatch('change:name', { name: 'iflux2' });
    expect({
      loading: true,
      name: 'iflux2'
    }).toEqual(appStore.bigQuery(userQL));
  });


  it('test dql', () => {
    const todoQL = todoDQL.context({ index: 0 }).ql();
    expect({
      id: 1,
      todo: {
        id: 1,
        text: 'hello dql',
        done: false
      }
    }).toEqual(appStore.bigQuery(todoQL).toJS());
  });

  it('conflict actor key', () => {
    class User extends Actor {
      defaultState() {
        return {
          id: 1,
          name: '',
          email: ''
        }
      }
    }

    class Address extends Actor {
      defaultState() {
        return {
          id: 1,
          addressName: ''
        }
      }
    }

    class Concat extends Actor {
      defaultState() {
        return {
          id: 1,
          addressName: ''
        }
      }
    }

    class MyStore extends Store {
      bindActor() {
        return [
          new User,
          new Address,
          new Concat
        ]
      }
    }

    new MyStore({debug: true})
  });
});

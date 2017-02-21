import { fromJS } from 'immutable';

import Store from '../src/store';
import Actor from '../src/actor';
import { QL, QueryLang } from '../src/ql';
import { Action } from '../src/decorator';
import { DQL } from '../src/dql';



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

const idQL = QL('idQL', [
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
    appStore.subscribe('');
    expect(0).toEqual(appStore._callbacks.length);
    //重复添加
    appStore.subscribe(mockSubscribeCallback);
    appStore.subscribe(mockSubscribeCallback);

    expect(1).toEqual(appStore._callbacks.length);

    appStore.unsubscribe('');
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
    const lang = todoDQL.context({ index: 0 }).analyserLang(todoDQL.lang());
    const todoQL = new QueryLang('todoQL', lang);

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

    new MyStore({ debug: true })
  });

  it('debug method', () => {
    appStore.pprint();
    appStore.pprintActor();
    appStore.pprintBigQuery(userQL);
    appStore
  });

  it('test StoreProvider subscribeStoreProvider', () => {
    appStore.subscribeStoreProvider('hello');
    expect(null).toEqual(appStore._storeProviderSubscribe);

    const cb = () => { };
    appStore.subscribeStoreProvider(cb);
    expect(cb).toEqual(appStore._storeProviderSubscribe);

    appStore.unsubscribeStoreProvider('');
    expect(cb).toEqual(appStore._storeProviderSubscribe);

    appStore.unsubscribeStoreProvider(cb);
    expect(null).toEqual(appStore._storeProviderSubscribe);

  });

  it('dispatch redux single object', () => {
    class HelloActor extends Actor {
      defaultState() {
        return {}
      }

      @Action('ADD_TO_DO')
      addTodo(state, {id, text, done}) {
        expect({ id, text, done }).toEqual({
          id: 1,
          text: 'hello iflux2',
          done: false
        })
        return state;
      }
    }

    class AppStore extends Store {
      bindActor() {
        return [
          new HelloActor
        ]
      }
    }

    const store = new AppStore({ debug: false });

    //如果参数不传递，直接报错
    try {
      store.dispatch();
    } catch (err) {
      expect(err.message).toEqual('😭 invalid dispatch without arguments')
    }

    store.dispatch({
      type: 'ADD_TO_DO',
      id: 1,
      text: 'hello iflux2',
      done: false
    })
  });

  it('batch dispatch', () => {
    class LoadingTestActor extends Actor {
      defaultState() {
        return {
          loading: true
        }
      }

      @Action('loading')
      loading(state, status) {
        return state.set('loading', status);
      }
    }

    class DefaultArgsActor extends Actor {
      defaultState() {
        return {
          defaultState: true
        }
      }

      @Action('change:state')
      changeState(state) {
        return state.set('defaultState', !state.get('defaultState'))
      }
    }

    class ReduxActor extends Actor {
      defaultState() {
        return {
          id: 1,
          name: '',
          done: false
        }
      }

      @Action('redux:action')
      change(state, todo) {
        return state.merge(todo);
      }
    }

    class BatchStore extends Store {
      bindActor() {
        return [
          new LoadingTestActor,
          new DefaultArgsActor,
          new ReduxActor,
        ]
      }

      batch = () => {
        this.batchDispatch([
          ['loading', true],
          ['loading', false],
          'change:state',
          { type: 'redux:action', id: 1, name: 'redux action', done: true }
        ]);

        expect(this.state().toJS()).toEqual({
          loading: false,
          defaultState: false,
          id: 1,
          name: 'redux action',
          done: true
        });
      }
    }

    const store = new BatchStore({ debug: false });
    store.batch();
  });
});

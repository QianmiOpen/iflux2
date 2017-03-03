import { fromJS } from 'immutable';
import { Actor, Action, Store, QL, DQL } from "../src/index";
import { QueryLang } from "../src/ql";

interface ReduxAction {
  type: string;
}

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
  changeName(state, { name }) {
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
    //重复添加
    appStore.subscribe(mockSubscribeCallback);
    appStore.subscribe(mockSubscribeCallback);
    expect(appStore._callbacks.length).toEqual(1);
  });

  it('store unsubscribe', () => {
    appStore.unsubscribe(mockSubscribeCallback);
    expect(appStore._callbacks.length).toEqual(0);
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
    expect(appStore.bigQuery(userQL)).toEqual({
      loading: true,
      name: 'iflux'
    });

    expect(appStore.bigQuery(idQL)).toEqual(1);
  });

  it('nested bigQuery test', () => {
    expect(appStore.bigQuery(idUserQL)).toEqual({
      id: 1,
      user: { loading: true, name: 'iflux' }
    })
  });

  it('dispatch', () => {
    appStore.dispatch('change:name', { name: 'iflux2' });
    expect(appStore.bigQuery(userQL)).toEqual({
      loading: true,
      name: 'iflux2'
    })
  });


  it('test dql', () => {
    const lang = todoDQL.context({ index: 0 }).analyserLang(todoDQL.lang());
    const todoQL = new QueryLang('todoQL', lang);

    expect(appStore.bigQuery(todoQL).toJS()).toEqual({
      id: 1,
      todo: {
        id: 1,
        text: 'hello dql',
        done: false
      }
    });
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

  it('dispatch redux single object', () => {
    class HelloActor extends Actor {
      defaultState() {
        return {}
      }

      @Action('ADD_TO_DO')
      addTodo(state, { id, text, done }) {
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
      expect(err.message).toEqual('😭 invalid dispatch without any arguments')
    }

    store.dispatch({
      type: 'ADD_TO_DO',
      id: 1,
      text: 'hello iflux2',
      done: false
    } as ReduxAction)
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

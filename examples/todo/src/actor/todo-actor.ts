import { Actor, Action, IMap } from 'iflux2'
import { fromJS, List } from 'immutable'

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

let uuid = 0

export default class TodoActor extends Actor {
  defaultState() {
    return {
      todo: []
    }
  }

  @Action('submit')
  submit(state: IMap, text: string) {
    return state.update('todo', (todo: List<IMap>) => todo.push(fromJS({
      id: ++uuid,
      text,
      done: false
    })))
  }


  @Action('toggle')
  toggle(state: IMap, index: number) {
    return state.updateIn(['todo', index, 'done'], done => !done)
  }


  @Action('destroy')
  destroy(state: IMap, index: number) {
    return state.deleteIn(['todo', index])
  }


  @Action('toggleAll')
  toggleAll(state: IMap, checked: boolean) {
    return state.update('todo',
      (todo: List<IMap>) => todo.map((v: IMap) => v.set('done', checked)))
  }


  @Action('clearCompleted')
  clearCompleted(state: IMap) {
    return state.update('todo',
      todo => todo.filter((v: IMap) => !v.get('done')))
  }

  @Action('init')
  init(state: IMap, todo: Todo) {
    return state.set('todo', fromJS(todo))
  }
}

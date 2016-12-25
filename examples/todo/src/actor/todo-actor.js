//@flow
import {Actor, Action} from 'iflux2'
import {fromJS} from 'immutable'
import type {Map, List, Record} from 'immutable'
let uuid = 0

type Todo = Record<{|
  id: number;
  text: string;
  done: boolean;
|}>;

type State = Map<string, List<Todo>>;

export default class TodoActor extends Actor {
  defaultState() {
    return {
      todo: []
    }
  }

  @Action('submit')
  submit(state: State, value: string) {
    return state.update('todo', (todo) => {
      return todo.push(fromJS({
        id: ++uuid,
        text: value,
        done: false
      }))
    })
  }


  @Action('toggle')
  toggle(state: State, index: number) {
    return state.updateIn(['todo', index, 'done'], (done) => !done)
  }


  @Action('destroy')
  destroy(state: State, index: number) {
    return state.deleteIn(['todo', index])
  }


  @Action('toggleAll')
  toggleAll(state: State, checked: boolean) {
    return state.update('todo', (todo) => todo.map((v: Todo) => v.set('done', checked)))
  }


  @Action('clearCompleted')
  clearCompleted(state: State) {
    return state.update('todo', todo => todo.filter((v: Todo) => !v.get('done')));
  }

  @Action('init')
  init(state: State, {todo}: {todo: Todo}) {
    return state.set('todo', fromJS(todo))
  }
}

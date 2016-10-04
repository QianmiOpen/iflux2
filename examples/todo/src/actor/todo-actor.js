import {Actor, Action} from 'iflux2'
import {fromJS} from 'immutable'
let uuid = 0


export default class TodoActor extends Actor {
  defaultState() {
    return {
      todo: []
    }
  }

  @Action('submit')
  submit(state, value) {
    return state.update('todo', (todo) => {
      return todo.push(fromJS({
        id: ++uuid,
        text: value,
        done: false
      }))
    })
  }


  @Action('toggle')
  toggle(state, index) {
    return state.updateIn(['todo', index, 'done'], (done) => !done)
  }


  @Action('destroy')
  destroy(state, index) {
    return state.deleteIn(['todo', index])
  }


  @Action('toggleAll')
  toggleAll(state, checked) {
    return state.update('todo', (todo) => todo.map(v => v.set('done', checked)))
  }


  @Action('clearCompleted')
  clearCompleted(state) {
    return state.update('todo', (todo) => {
      return todo.filter(v => !v.get('done'))
    })
  }

  @Action('init')
  init(state, {todo}) {
    return state.set('todo', fromJS(todo))
  }
}

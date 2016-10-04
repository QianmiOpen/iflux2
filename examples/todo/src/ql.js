import {QL, DQL} from 'iflux2'
import {fromJS} from 'immutable'


/**
 * 查询输入框的值
 */
export const valueQL = QL('valueQL', [
  'value',
  value => value
])


/**
 * 查询todo
 */
export const todoQL = QL('todoQL', [
  'todo',
  'filterStatus',
  (todo, filterStatus) => {
    if (filterStatus === '') {
      return todo
    }
    const done = filterStatus === 'completed' ? true : false
    return todo.filter(v => v.get('done') === done)
  }
])


/**
 * 查询todo的数量
 */
export const countQL = QL('countQL', [
  todoQL,
  todoQL => todoQL.count()
])



/**
 * 动态查询，运行期relax会自动替换$index
 */
export const todoDQL = DQL('todoDQL', [
  ['todo', '$index'],
  todo => todo || fromJS({})
])

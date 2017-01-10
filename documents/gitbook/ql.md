# QL

QL = Query Lang

自定义查询语法，数据的源头是store的state()返回的数据


## Syntax
QL(displayName, [string|array|QL..., fn])

displayName，主要是帮助我们在debug状态更好地日志跟踪

string|array|QL: string|array都是immutable的get的path, QL其他的QL(支持无限嵌套)

例如：
```js
import {OrderedMap) from 'immutable'

const user = OrderMap({
  id: 1,
  name: 'iflux2',
  address: {
    city: '南京'
  }
})

const id = user.get('id') //path => id
const name = user.get('name') //path => name
const city = user.getIn(['address', 'city']) //path => ['address', 'city']
```

fn: 可计算状态的回调函数，bigQuery会取得所有的所有的数组中的path对应的值，作为参数传递给fn,例如：


```js
/**
 * 返回：{
 * id: 1,
 * name: 'iflux2',
 * address: {
 *   city: '南京'
 * }
 *}
 */
 store.state()

// QL计算的结果值是 “iflux2南京"
const ifluxQL = QL('ifluxQL', [
  'name',
  ['address', 'city'],
  (name, city) => `${name}${city}`
])

store.bigQuery(ifluxQL) //iflux2南京
```

## QL in QL

```js
import {QL} from 'iflux2'

const loadingQL = QL('loadingQL', [
  'loading',
  loading => loading
])

const userQL = QL('userQL', [
  //query lang 支持嵌套
  loadingQL,
  ['user', 'id'],
  (id, loading) => ({id, loading})
])
```

## why?

为什么我们需要一个QL
1. 如果我们把我们的state看成source data，我们需要有派生数据的能力，因为UI展示的数据，可能需要根据我们的源数据进行组合

2. 我们需要我们的UI的数据具有reactive的能力，当source data变化的时候，@Relax会去重新计算我们的QL，达到数据Reactive的能力

3. 是的，命令式的编程手动的精确的处理数据之间的依赖和更新，Reactive会不够精确，导致同一个QL可能会被执行多次，造成计算上的浪费，不过不需要担心，我们已经添加了合适的cache，确保path对应的数据没有变化的时候，QL不会重复计算

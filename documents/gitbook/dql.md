# DQL

DQL = Dynamic Query Lang

自定义查询语法，数据的源头是store的state()返回的数据

# Why?

为什么有了QL还需要DQL，主要是两个场景，QL的最大限制是依赖的state的数据路径必须是确定的，不可以动态设置参数的路径
而DQL可以是动态的路径，DQL的解析器会根据上下文的参数，替换动态参数，替换完返回QL，然后bigQuery计算出结果，
__动态参数以$开头__


## Syntax
DQL(displayName, [string|array|QL..., fn])

displayName，查询语言名字，主要是帮助我们在debug状态更好地日志跟踪

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



假设我们的state:

store.state()

```js
{
  loading: true,
  todo: [
    {id: 1, name: 'iflux2', done: true},
    {id: 2, name: 'Rust', done: false}
    {id: 3, name: 'Ocaml', done: false}
  ]
}
```

```js
const todoDQL = QL('todoDQL', [
  ['todo', '$index', 'name'],
  (name) => name
]);

const todoQL = todoDQL.context({
  id: 1
});

store.bigQuery(todoQL); // 返回Rust

```

## QL in DQL


```js
import {QL, DQL} from 'iflux2'

const loadingQL = QL('loadingQL', [
  'loading',
  loading => loading
])

const todoDQL = QL('todoDQL', [
  //query lang 支持嵌套
  loadingQL,
  ['todo', '$id', 'name'],
  (loading, name) => {
    return loading ? name : '';
  }
])
```

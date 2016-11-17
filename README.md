> New Idea, New the World.


技术也是时尚驱动的，我们常常臣服于时尚，面对快速的变化常常让我们局促不安，
开始焦虑，唯恐错过了些什么。怎么打破这种焦虑？需要在快速变化得世界里保持清醒，
保持独立的思考和认知。
让我们回归到技术的本质, 因为解决了真实的问题，技术才变得有价值。
**真正牛*的技术，都是静悄悄的跑在线上...**

### iflux2

[![NPM](https://nodei.co/npm/iflux2.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/iflux2)

Reactive and Predictable state container  for React or ReactNative.

* Thanks Immutable.js
* Thanks MapReduce
* Thanks Functional Reactive Programming.



### iflux
很早很早之前，我们爱上了React and immutable，所以就有了很简单的iflux。

*[iflux](https://github.com/QianmiOpen/iflux) = immutable.js + react.js*

[![NPM](https://nodei.co/npm/iflux.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/iflux)


保持简单
```
+-----------------------+
|       WebApi          |
+-----------------------+
          |  
         \|/
+-----------------------+
|   Store（immutable）   |<-----+
+-----------------------+      |
           | //es5 style       |
           | StoreMixin        | msg(EventEmitter)
          \|/                  |
+------------------------+     |
|     React App          |-----|
+------------------------+
|      <Layout>          |
|        <SearchForm/>   |
|        <Toolbar/>      |
|        <DataGrid/>     |
|       </Layout>        |
+------------------------+
```

优点：
* 简单直接，几乎没有什么规则
* 单根数据源(single data source)
* Immutable fronted UI
* High Performance

但是随着业务的不断的发展，数据层的复杂度也在上升。这时候iflux就会暴露出很多的缺点
* Big Store, Store中大量的数据和业务的处理，代码膨胀的厉害
* Store是单例，不销毁，有共享的问题
* store的数据通过props不断的透传，代码写的很费劲
* 大量的数据之间的依赖关系，需要手动的保证和处理

### 怎么解决?
* 使用MapReduce的理念解决big Store
* 使用@Relax自动注入store中的数据和事件
* Store不再是单例
* 使用FRP的理念, 简单的实现反应式数据，抽象源数据和派生数据


这就是我们的iflux2
```text
+------------------+
|     BFF-API      |
+------------------+
        ||
        \/
+------------------+
|     WebApi       |
+------------------+
        ||
        \/
+------------------+
|     Store        | ====> [Actor1, Actor2, Actor3]
+------------------+
        ||
        \/
+------------------+
|  @StoreProvider  |
+------------------+
        ||
        \/
+------------------+
|     @Relax       |
+------------------+
        ||
        \/
+------------------+
|     QL/DQL       |
+------------------+
```

## 例子
```text
→ tree -L 2                                                                                              [c6c2861]
.
├── actor
│   └── counter-actor.js
├── component
│   └── counter.js
├── index.html
├── index.js
├── package.json
├── ql.js
├── store.js
├── webapi.js
└── webpack.config.js

2 directories, 9 files
```

```js
//counter-actor.js
import { Actor, Action } from 'iflux2'


export default class CounterActor extends Actor {
  defaultState() {
    return {
      count: 0
    }
  }

  @Action('increment')
  increment(state) {
    return state.update('count', count => count + 1)
  }

  @Action('decrement')
  decrement(state) {
    return state.update('count', count => count - 1)
  }
}

```

```js
//store.js
import { Store } from 'iflux2'
import CounterActor from './actor/counter-actor'


export default class AppStore extends Store {
  bindActor() {
    return [
      new CounterActor
    ]
  }

  constructor(props) {
    super(props)
    if (__DEV__) {
      //you can use _store directly in browser's console
      window._store = this
    }
  }

  //;;;;;;;;;;;;;;;;;Action;;;;;;;;;;;;;;;;;;;;;;;;;;;;
  increment = () => {
    this.dispatch('increment')
  };

  decrement = () => {
    this.dispatch('decrement')
  };
}
```

```js
//index.js
import React, { Component } from 'react'
import { render } from 'react-dom'
import { StoreProvider } from 'iflux2'
import AppStore from './store'
import Counter from './component/counter'

// debug: true 更多的console信息
@StoreProvider(AppStore, {debug: true})
export default class CounterApp extends Component {
  render() {
    return (
      <Counter/>
    )
  }
}

render(<CounterApp/>, document.getElementById('app'))
```

```js
//counter.js
import React, { Component } from 'react'
import { Relax } from 'iflux2'
import { countQL } from '../ql'
const noop = () => {}


@Relax
export default class Counter extends Component {
  static defaultProps = {
    count: 0, //Inject by store's count
    countQL,  //calculate by store's bigQuery
    increment: noop, //Inject by store's increment
    decrement: noop //Inject by store's decrement
  };


  render() {
    const { count, countQL, increment, decrement } = this.props

    return (
      <div>
        <a href='javascript:void(0);' onClick={increment}>increment</a>
        <br/>
        <span>{ count }</span>
        <br/>
        <span>{ countQL }</span>
        <br/>
        <a href='javascript:void(0);' onClick={decrement}>decrement</a>
      </div>
    )
  }
}
```

```js
//ql.js
import { QL } from 'iflux2'

export const countQL = QL('countQL', [
  'count',
  (count) => `QL:${count}`
]);

```

### how to use?
```sh
npm install iflux2 --save
```

> web

```js
//web .babelrc
{
  "presets": ["es2015", "react", "stage-3"],
  "plugins": [
    "transform-decorators-legacy", //required, 必须在class-properties之前！
    "transform-class-properties",
    "transform-es2015-modules-commonjs",
    "transform-flow-strip-types",
    "transform-runtime"
  ],
  "env": {
    "production": {
      "plugins": [
        "transform-react-constant-elements",
        "transform-react-inline-elements"
      ]
    }
  }
}
```

> react-native

```js
//react-native .babelrc
{
  "presets": ["react-native"],
  "plugins":[
    "transform-decorators-legacy"
  ]
}
```

```text
➜  Hello tree -L 1
.
├── __tests__
├── android
├── index.android.js
├── index.ios.js
├── ios
├── node_modules
├── package.json
├── react-dom //拷贝这个react-native mock的react-dom
├── tsconfig.json
├── typings
└── yarn.lock

6 directories, 5 files
```

```js
//package.json
"scripts": {
  "postinstall": "npm install ./react-dom"
}
```

react-native demo可以参考 https://github.com/QianmiOpen/iflux2/tree/master/examples/iflux2Native

### more examples

* https://github.com/hufeng/iflux2-blog
* https://github.com/hufeng/iflux2-todo
* https://github.com/hufeng/iflux2-counter
* https://github.com/brothers-js/iflux2-validator-demo

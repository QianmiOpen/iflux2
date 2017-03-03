# StoreProvider

> talk is cheap, show me code

```js
 import React, {Component} from 'react';
 import {StoreProvider} from 'iflux2'
 import AppStore from './store'


 @StoreProvider(AppStore)
 class ShoppingCart extends Component {
   render() {
     return (
       <Scene>
         <HeaderContainer/>
         <ShoppingListContainer/>
         <BottomToolBarContainer/>
       </Scene>
     )
   }
 }
```

StoreProvider容器组件衔接我们的React组件和AppStore。向React组件提供数据源。

在StoreProvider中的主要任务是，
1. 初始化我们的AppStore
2. 将AppStore的对象绑定到React组件的上下文
3. Relay就是通过上下文取的store对象

我们还提供了debug模式，开启debug模式
```js
import React, {Component} from 'react';
 import {StoreProvider} from 'iflux2'
 import AppStore from './store'


 //enable debug
 @StoreProvider(AppStore, {debug: true})
 class ShoppingCart extends Component {
   render() {
     return (
       <Scene>
         <HeaderContainer/>
         <ShoppingListContainer/>
         <BottomToolBarContainer/>
       </Scene>
     )
   }
 }
```
一个简单的debug标记，我们就可以跟踪每个dispatch，每个Relax，每个bigQuery

# Store

Store, 我们的数据状态容器中心，管理着整个app的数据的生命周期。
我们坚守单根数据源的思想(single data source)，store中保持着完整的页面需要的状态


在iflux2中store的主要职责有哪些?

1. 聚合actor
2. 分派actor
3. 通过bigQuery计算我们的查询语言(QL)
4. 响应页面的事件(ActionCreator)
5. 计算流程的控制(dispatch => actor)


# Talk is cheap, Show me code.


```js
 import {Store} from 'iflux2'
 import LoadingActor from 'loading-actor'
 import UserActor from 'user-actor'
 import TodoActor from 'todo-actor'

 class AppStore extends Store {
   //聚合Actor
   bindActor() {
     return [
       new LoadingActor,
       new UserActor,
       new TodoActor
     ]
   }

   //;;;;;;;;;;;;;action;;;;;;;;;;;;;;
   update = () => {
     //通过dispatch分派到actor
     this.dispatch('update')
   };

   save = () => {
    //通过dispatch分派到actor
     this.dispatch('save')
   };
 }
```

##关键API

//获取从actor聚合出来的页面需要的状态数据(immutable)
state()

//非常重要的方法，计算QL
bigQuery()

//分派计算任务给actor处理
dispatch()


//;;;;;;;;;;;;;;;;;;辅助方法;;;;;;;;;;;;;;;;;;;;;;
pprint() //打印出来state()的值，辅助我们查看state

pprintActor() //打印出{actorName: actor defaultState ....}

pprintBigQuery() //打印出bigQuery的计算结果，辅助调试


## source
[source](http://git.dev.qianmi.com/OF730/iflux2/blob/master/src/store.js)

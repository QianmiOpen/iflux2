# Actor
学习Erlang或者Scala中的Actor的计算模型，一个独立的计算单元，主要作用就是转换我们的状态数据，以OO的观点看数据，更多的是hide data，以fp的观点看数据，更多的是transform data.我们取OO得形，得FP的意。以OO的方式封装我们代码的结构，以函数式的方式处理状态,为什么我们可以这样放心大胆的用，感谢Immutable。


# Talk is cheap, Show me code

```js
  //简单的例子
  import {Actor, Action} from 'iflux2'

  export default class Iflux2Actor extends Actor {
    /**
     * 领域模型数据
     */
    defaultState() {
      return {
        id: 1,
        name: 'iflux2',
        version: '1.0.0'
      }
    }

    /**
     * 注册dispatch的自定义handler
     */
    @Action('update:version')
    update(state) {
      return state.set('version', '1.1.0');
    }
  }
```


> 简单我们我们永恒的追求

Actor所有子Actor的父类，子Actor继承Actor这个父类之后，通过简单的@Action这个Decorator
就获取了receive动态分派的能力，store在dispatch方法内部会自动的调用receive


# 关于decorator
借助Babel的decorators插件
```js
{"babel-plugin-transform-decorators-legacy": "^1.3.4"}
```
我们就可以使用这个@Action


# 等到webworker
后面会让Actor变成名副其实的actor，支持并行计算

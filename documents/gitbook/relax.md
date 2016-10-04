# Relax

> Talk is cheap, show me code

```js
import React, {Component} from 'react'
import {Relax} from 'iflux2'

@Relax
class User {
  /**
   *relax 会自动查询数据注入
   */
  static defaultProps = {
    name: nameQL,
    url: urlQL
    id: 0
  };

  render() {
    //自动注入name，url,id
    const {id, name, url} = this.props;

    return (
      <div>
        id: {id}
        name: {name}
        url: <img src={url}/>
      </div>
    );
  }
}
```

Relax是iflux2中非常重要的容器组件，类似Spring的依赖注入一样，会根据子组件的defaultProps中声明的数据，通过智能计算属性的值，然后注入到子组件的内部。

计算的属性的顺序：
1. 属性的值是不是query-lang,如果是通过store的bigQuery计算
2. 是不是父组件传递的props
3. 是不是store的方法
4. 是不是store中的状态值
5. 默认值

__store__:store的值，是通过StoreProvider绑定到顶层组件的context中。

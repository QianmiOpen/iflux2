# iflux2


>实践是检验真理的唯一标准


### 由重构采购单想到的？

在电商的采购单中，常常涉及到非常复杂的数据和业务的处理，常见的领域对象：
1. 商家(store)
2. 商品(product)
3. 货品(good)
4. 营销活动(market, 满减，满赠，满折，选赠，全增)
5. 赠品(gift)


#### 关联关系
store -> product -> good -> market -> gift


### api层改返回什么样的数据呢？
重构之前，返回的是nested(嵌套的)数据结构，如：
```js
{
  stores: [{
    storeId: 1,
    storeName: 'test',
    product: [{
      pId: 1,
      pName: 'iphone se',
      goods: [{
        gId: 1,
        gName: 'iphone se 金色 64G',
        markets: {
          mId: 1,
          mName: '满100 减10'，
          gift: []
        }
      }]
    }]
  }]
}
```

面对这个复杂的嵌套数据结构，很多的代码的逻辑的实现超复杂，比如，我们想知道采购单中货品的总数，囧了，要嵌套循环了。越是曾经深，数据的访问或者转换都超复杂。

这里面前端的兄弟数据结构设计的不够合理，导致后端的兄弟开发也是非常的痛苦，那酸爽的循环嵌套。

这里面缺少：
1. 设计上需要领域对象，如果完全按照页面展示的数据的嵌套设计据，这样导致我们的业务处理非常的复杂。
2. nested的数据结构扩展性非常差，而且数据冗余非常厉害

###那怎么办？

首先理清职责：

1.api返回的数据应该是最通用的，不假设端的使用方式和展示方式，因为ui的变化太快。

2.UI需要的数据结构应该是从领域转化，数据应该是一个pipeline的过程。


那什么样的数据结构可以承担这个职责？
答案是：normalize(json-graph类似falcon)扁平化的数据结构


例如：
nested

```js
[{
  id: 1,
  title: 'Some Article',
  author: {
    id: 1,
    name: 'Peter'
  }
}, {
  id: 2,
  title: 'Other Article',
  author: {
    id: 1,
    name: 'Peter'
  }
}]
```

变换后：
```js
  {
    articles:
    {
      1: {
        id: 1,
        title: 'Some Article',
        author: 1
      },
      2: {
        id: 2,
        title: 'Other Article',
        author: 1
      }
    },
    users: {
      1: {
        id: 1,
        name: 'Dan'
      }
    }
  }
```

还原每个领域对象，不嵌套，通过关联关系引用，目前是单项的依赖，为了方便处理，可以会有双向的数据依赖，这时候就形成另一种数据结构，json-graph。

So我们的采购单的数据结构就可以变为：
```js
{
  stores: {
    id,
    name:
    productIds:[1,2]
  },
  products:{
    id,
    name,
    goodIds: []
  },
  goods:{
    id,
    name,
    mkts:[]
  },
  mkts:{..},
  gifts:{..}
}
```

现在我们去做业务的计算就非常简单了，整体数据量也变得更小，而且数据结构很容易扩展。

__So首先api层返回的是一个json-graph或者扁平化的数据，
api的代码也变得很简单。__

剩下的就是前端需要解决的问题了，怎么把这个数据结构变成ui层迭代比较方便的数据结构了。

另外就是，数据之间的依赖，每当任何一个数据发生变化的时候，按照命令式的编程风格，我们需要自己手动的去重新计算所有的数据依赖去计算值。

```text
比如，采购单总金额，就依赖了，选中的货品，货品的用户级别价，货品的数据。

当选中的商品发生变化，需要重新计算价格
当用户级别价发生变化，需要重新计算价格
当货品数量发生变化，需要重新计算价格
.....

当任何依赖的数据发生变化时候，都需要计算。。
当业务非常复杂的时候，代码量很难控，另外就是bug比较多，很难定位。
```

针对这两个问题怎么去解决呢？这是两个问题吗？no其实本质是一个问题，就是需要一个有很方便的pipeline我们的领域数据的能力，切这个最好可以自动执行。

__问题思考越清楚，你就越知道自己想要什么。__

我们需要Reactive Function Programming.

我们需要一个反应式的数据层。

最初的实现，我们使用Object.defineProperty 用了get/set，初步达到了我们的设想。但是这种方案是有弊端的，
IE8上面没有办法兼容，且没有办法去pollyfill。

So我们就设计一个很简单的数据查询语言(:)真的很简单),QL（Query language）.
有了这个QL我们就可以实时的去计算，动态去计算，这个交给了框架去做，而不需要我们手动的去计算结果。

```text
这样就有点类似excel的意思了，比如有30行代表了学生的高考成绩，第31行是一个规则，sum上面30行的值，每当任何一个值发生变化的时候，总成绩会自动变化。
```
聪明的小伙伴立刻支持了这种缺点，你的计算量变多了？可能这个ql会被执行多次？

Yes,Yes, or no?

不要紧张，因为我们用了immtable，So我们很简单的就搞定了QL的cache机制，so放心吧。
So通过实际的问题和痛点，我们沉淀出了我们新的架构，iflux2，在iflux的基础上继往开来。


__iflux2：__

```text
         [api-bff]
            |
         [json-graph]   
            |    -> actor
         [store] -> actor
                 -> actor
            |
          [QL-bigQuery]
            |
          [StoreProvider]
            |
          [ReactView]  
            |
          [Relax]
            |
          [ ReactComponent ]
```

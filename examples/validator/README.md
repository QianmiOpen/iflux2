iflux2-validator demo

思路：

不在校验dom，而是校验我们的领域对象（domain object）,
view只是显示了我们的校验结果而已。

目标： 声明式的校验表达

1. 校验全部配置的数据
2. 校验配置数据中的部分数据
4. 异步校验使用正常业务逻辑流转

```sh
yarn
yarn start
```

http://localhost:3000/

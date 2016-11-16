/**
 * 科学的方式分析改进系统的性能问题
 * M.P.D.I.A
 * M: Measure
 * P: Profile
 * D: Diagnose
 * I: Indentify
 * A: Attemp
 * 
 * 通过timeline迅速了解系统的整个时间流
 */
const Immutable = require('immutable');
const {fromJS, OrderedMap} = Immutable;


/**
 * 旧的reduceState的算法
 */
const reduceState = (actorState) => {
  return actorState.valueSeq().reduce((init, value) => {
    return init.merge(value);
  }, OrderedMap());
};

/**
 * 新的reduceState算法
 */
const newReduceState = (actorState) => {
  return OrderedMap().update(value => {
    return actorState.valueSeq().reduce((init, state) => {
      return init.merge(state);
    }, value);
  });
};

//mock data
const actorState = fromJS({
  1: {
    storeId:1,
    storeName: 'App-Store',
  },
  2: {
    productId: 1,
    productName: 'test',
  },
  3: {
    goodsId: 1,
    goodsName: 'test red',
    specList: [
      {1: 'red'},
      {2: 'xxl'},
      {3: '100G'}
    ]
  }
});


/**
 * origin#reduceState: 2.532ms
 * new#reduceState: 0.227ms
 */

console.time('origin#reduceState');
reduceState(actorState);
console.timeEnd('origin#reduceState');

console.time('new#reduceState');
reduceState(actorState);
console.timeEnd('new#reduceState');
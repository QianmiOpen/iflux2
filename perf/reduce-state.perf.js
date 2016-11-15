const Immutable = require('immutable');
const {fromJS, OrderedMap} = Immutable;


const reduceState = (actorState) => {
  return actorState.valueSeq().reduce((init, value) => {
    return init.merge(value);
  }, OrderedMap());
};

const newReduceState = (actorState) => {
  return OrderedMap().update(value => {
    return actorState.valueSeq().reduce((init, state) => {
      return init.merge(state);
    }, value);
  });
};

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



console.time('origin#reduceState');
reduceState(actorState);
console.timeEnd('origin#reduceState');

console.time('new#reduceState');
reduceState(actorState);
console.timeEnd('new#reduceState');
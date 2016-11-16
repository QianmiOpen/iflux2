import {fromJS, OrderedMap} from 'immutable';

function merge(a) {
  return OrderedMap().update((value) => {
    return a.valueSeq().reduce((init, state) => {
      return init.merge(state);
    }, value);
  });
}

test('immutable merge', () => {
  var a = fromJS({
    a: {a: {a: 1}},
    b: {b: {b: 1}}
  });
  var b = merge(a);
  
  expect(true).toEqual(b.get('a') == a.getIn(['a', 'a']));
  expect(true).toEqual(b.get('b') == a.getIn(['b', 'b']))
  
  const test = a.setIn(['b', 'b', 'b'], 2);
  
  var c = merge(test);

  expect(true).toEqual(b.get('a') == c.getIn(['a']));
  expect(false).toEqual(b.get('b') == c.getIn(['b']));
});
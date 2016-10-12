import Atom from '../src/atom';


const appCache = new Atom({
  token: 'auth fsdfjkferwerjk',
  skuCountList: {
    g1101: 9,
    g1102: 10
  }
});


describe('atom test suite', () => {
  it('value test', () => {
    //path is array
    expect('auth fsdfjkferwerjk')
      .toEqual(appCache.value(['token']));
    
    //path is string
    expect('auth fsdfjkferwerjk')
      .toEqual(appCache.value('token'));

    //path is array
    expect(9)
      .toEqual(appCache.value(['skuCountList', 'g1101']));

    //path is undefined
    expect({
      token: 'auth fsdfjkferwerjk',
      skuCountList: {
        g1101: 9,
        g1102: 10
      }
    }).toEqual(
      appCache.value().toJS()
    )
  });


  it('set value', () => {
    //覆盖if
    appCache.subscribe();

    //newState == state
    appCache.cursor().set('token', 'auth fsdfjkferwerjk');

    //可能发生的数据更新不同步的问题
    //withMutations是如此的重要
    const cursor = appCache.cursor();
    cursor.set('token', 'test');
    cursor.set('token', 'test`1');


    appCache.subscribe((state) => {
      expect(100)
        .toEqual(state.getIn(['skuCountList', 'g1101']));
    });

    appCache
      .cursor()
      .setIn(['skuCountList', 'g1101'], 100);
    
  });


  it('unsubscribe', () => {
    //覆盖line-93
    appCache.unsubscribe();

    const callback = () => {};
    appCache.subscribe(callback);
    expect(2).toEqual(appCache._callbacks.length);

    appCache.unsubscribe(callback);
    expect(1).toEqual(appCache._callbacks.length);
  });
});
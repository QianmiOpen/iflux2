import {
  isArray,
  isStr,
  isFn,
  filterActorConflictKey
} from '../src/util';
import {QL} from '../src/ql';
import Actor from '../src/actor'


describe('util test suite', () => {
  it('it should be array', () => {
    expect(true).toEqual(
      isArray([1,2,3])
    );

    expect(false).toEqual(
      isArray({})
    );
  });

  it('it should be string', () => {
    expect(true).toEqual(
      isStr('hello')
    );

    expect(false).toEqual(
      isStr(1323)
    );
  });

  it('it should be fn', () => {
    expect(true).toEqual(
      isFn(() => {})
    );

    expect(false).toEqual(
      isFn(123)
    );
  });

  it('actorFilterConflict', () => {

    expect([]).toEqual(
      filterActorConflictKey([])
    )

    class User extends Actor {
      defaultState() {
        return {
          id: 1,
          name: '',
          email: ''
        }
      }
    }

    class Address extends Actor {
      defaultState() {
        return {
          id: 1,
          addressName: ''
        }
      }
    }

    class Concat extends Actor {
      defaultState() {
        return {
          id: 1,
          addressName: ''
        }
      }
    }

    const key = filterActorConflictKey([
      new User,
      new Address,
      new Concat
    ]);

    expect([
      ['id', ['User', 'Address', 'Concat']],
      ['addressName', ['Address', 'Concat']]
    ]).toEqual(key)
  });
});

import {fromJS} from 'immutable'

class Store {
  state() {
    return fromJS({
      d: false
    })
  }
}

const store = new Store();


class Relax {
  constructor(props, defaultProps) {
    this.props = props;
    this.defaultProps = defaultProps;
  }

  _isNotUndefinedOrNull(param: any) {
    return typeof (param) != 'undefined' && null != param;
  }

  getProps() {
    const props = {};
    const defaultProps = this.defaultProps;


    for (let propName in defaultProps) {
      if (defaultProps.hasOwnProperty(propName)) {

        props[propName] = defaultProps[propName];
        //如果默认属性中匹配上
        if (this._isNotUndefinedOrNull(this.props[propName])) {
          props[propName] = this.props[propName];
        } else if (this._isNotUndefinedOrNull(store[propName])) {
          props[propName] = store[propName];
        } else if (this._isNotUndefinedOrNull(store.state().get(propName))) {
          props[propName] = store.state().get(propName);
        }
      }
    }
    return props;
  }
}

const relax = new Relax(
  {a: 0,b: false}, 
  {
    a: 1,
    b: true,
    d: true
  });


describe('relax test suite', () => {
  it('null or undefined', () => {
    console.log(relax.getProps());
    expect(0).toEqual(relax.getProps()['a']);
    expect(false).toEqual(relax.getProps()['b']);
    expect(false).toEqual(relax.getProps()['d']);
  });
});
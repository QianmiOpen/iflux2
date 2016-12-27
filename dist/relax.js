/**
 * 致敬Reley,更希望我们小伙伴可以relax
 *
 * Relax根据containerComponent的defaultProps
 * 自动数据依赖注入, 数据源优先级为:
 * 1. this.props
 * 2. store的action函数
 * 3. query-lang
 * 4. store的state
 * 5. 组件设置的默认值
 *
 * 
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = Relax;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _ql = require('./ql');

var _dql = require('./dql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function Relax(Component) {
  var _class, _temp;

  return _temp = _class = function (_React$Component) {
    _inherits(RelaxContainer, _React$Component);

    function RelaxContainer(props) {
      _classCallCheck(this, RelaxContainer);

      var _this = _possibleConstructorReturn(this, (RelaxContainer.__proto__ || Object.getPrototypeOf(RelaxContainer)).call(this, props));

      _this._subscribeStoreChange = function (state) {
        if (_this._isMounted) {
          //re-render
          _this.setState({ storeState: state });
        }
      };

      _this._isMounted = false;
      _this.state = {
        storeState: (0, _immutable.fromJS)({})
      };
      return _this;
    }

    //当前的状态

    //当前组件的挂载状态

    //当前的所有的子组件的props

    //debug状态


    _createClass(RelaxContainer, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        //设置当前组件的状态
        this._isMounted = false;

        //检查store是不是存在上下文
        if (!this.context.store) {
          throw new Error('Could not find any @StoreProvider bind AppStore in current context');
        }

        //设置debug级别
        this._debug = this.context.store._debug;
        if (this._debug) {
          console.time('relax time');
          console.groupCollapsed('Relax(' + Component.name + ') will mount');
        }

        //计算最终的props,这样写的是避免querylang的重复计算
        this._relaxProps = (0, _objectAssign2.default)({}, this.props, this.getProps(this.props));

        //trace log
        if (this._debug) {
          console.timeEnd('relax time');
          console.groupEnd();
        }
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this._isMounted = true;
        this.context.store.subscribe(this._subscribeStoreChange);
      }
    }, {
      key: 'componentWillUpdate',
      value: function componentWillUpdate() {
        this._isMounted = false;
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        this._isMounted = true;
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.context.store.unsubscribe(this._subscribeStoreChange);
      }

      /**
       * 3ks immutable
       * @param nextProps
       * @returns {boolean}
       */

    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        if (this._debug) {
          console.time('relax time');
          console.groupCollapsed('Relax(' + Component.name + ') should update');
        }

        //compare nextProps && this.props
        //如果属性不一致, 就去render
        if (Object.keys(nextProps).length != Object.keys(this.props).length) {
          if (this._debug) {
            console.groupEnd();
          }

          return true;
        }

        //合并新的属性集合
        //判断是不是数据没有变化, 如果没有变化不需要render
        var newRelaxProps = (0, _objectAssign2.default)({}, nextProps, this.getProps(nextProps));

        for (var key in newRelaxProps) {
          if (newRelaxProps.hasOwnProperty(key)) {
            if (newRelaxProps[key] != this._relaxProps[key]) {
              this._relaxProps = newRelaxProps;

              //trace log
              if (this._debug) {
                console.timeEnd('relax time');
                console.groupEnd();
              }

              return true;
            }
          }
        }

        if (this._debug) {
          console.log('Relax(' + Component.name + ') avoid re-render');
          console.timeEnd('relax time');
          console.groupEnd();
        }

        return false;
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(Component, this._relaxProps);
      }

      /**
       * 计算prop的值 然后自动注入
       *
       * 1. 默认属性是不是存在，不存在返回空对象
       * 2. 默认属性的值是不是一个合法的query-lang， 如果是就在store中通过bigQuery计算
       * 3. 默认属性是不是在父组件传递的props中，如果是取
       * 4. 是不是store得属性
       * 5. 是不是store得某个key值
       * 6. 都不是就是默认值
       */

    }, {
      key: 'getProps',
      value: function getProps(reactProps) {
        var dql = {};
        var props = {};
        var store = this.context.store;

        var defaultProps = Component.defaultProps || {};

        for (var propName in defaultProps) {
          if (defaultProps.hasOwnProperty(propName)) {

            //判断defaultProps的值是不是query的语法
            var propValue = defaultProps[propName];
            if (propValue instanceof _ql.QueryLang) {
              props[propName] = store.bigQuery(propValue);
              continue;
            }

            //隔离出来DQL
            if (propValue instanceof _dql.DynamicQueryLang) {
              dql[propName] = propValue;
            }

            props[propName] = defaultProps[propName];

            //如果默认属性中匹配上
            if (RelaxContainer._isNotUndefinedAndNull(reactProps[propName])) {
              props[propName] = reactProps[propName];
            } else if (RelaxContainer._isNotUndefinedAndNull(store[propName])) {
              props[propName] = store[propName];
            } else if (RelaxContainer._isNotUndefinedAndNull(store.state().get(propName))) {
              props[propName] = store.state().get(propName);
            }
          }
        }

        //开始计算DQL
        for (var _propName in dql) {
          if (dql.hasOwnProperty(_propName)) {
            props[_propName] = store.bigQuery(dql[_propName].context(props).ql());
          }
        }

        return props;
      }

      /**
       * 判断当前的值是不是undefined或者null
       * @param  {any} param
       */

    }], [{
      key: '_isNotUndefinedAndNull',
      value: function _isNotUndefinedAndNull(param) {
        return typeof param != 'undefined' && null != param;
      }
    }]);

    return RelaxContainer;
  }(_react2.default.Component), _class.displayName = 'Relax(' + getDisplayName(Component) + ')', _class.contextTypes = {
    store: _react2.default.PropTypes.object
  }, _temp;

  /**
   * displayName
   */
  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }
}
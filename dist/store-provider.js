'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = connectToStore;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * StoreProvider
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 主要的作用是在Store和React的App之间建立桥梁
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 将Store初始化,切绑定到React顶层App的上下文
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * WrapperComponent
 * @param AppStore
 * @param opts
 * @returns {Function}
 */
function connectToStore(AppStore) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return function (Component) {
    var _class, _temp;

    //proxy Component componentDidMount
    var proxyDidMount = Component.prototype.componentDidMount || function () {};
    //清空
    Component.prototype.componentDidMount = function () {};

    return _temp = _class = function (_React$Component) {
      _inherits(StoreContainer, _React$Component);

      //关联的store
      function StoreContainer(props) {
        _classCallCheck(this, StoreContainer);

        //如果是debug状态
        var _this = _possibleConstructorReturn(this, (StoreContainer.__proto__ || Object.getPrototypeOf(StoreContainer)).call(this, props));

        _this.getChildContext = function () {
          return {
            store: _this._store
          };
        };

        _this._handleStoreChange = function (cb) {
          if (_this._isMounted) {
            _this.forceUpdate(function () {
              return cb();
            });
          }
        };

        if (opts.debug) {
          console.group('StoreProvider(' + Component.name + ') in debug mode.');
          console.time('first-render-time');
        }

        //初始化当前的组件状态
        _this._isMounted = false;
        //初始化Store
        _this._store = new AppStore(opts);
        return _this;
      }
      //当前的组件状态


      _createClass(StoreContainer, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          if (opts.debug) {
            console.timeEnd('first-render-time');
            console.groupEnd();
          }
          this._isMounted = true;
          this._store.subscribe(this._handleStoreChange, true);

          //代理的子componentDidMount执行一次
          if (this.App) {
            proxyDidMount.call(this.App);
          }
        }
      }, {
        key: 'componentWillUpdate',
        value: function componentWillUpdate() {
          this._isMounted = false;
          if (opts.debug) {
            console.group('StoreProvider(' + Component.name + ') will update');
            console.time('update-render-time');
          }
        }
      }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
          this._isMounted = true;
          if (opts.debug) {
            console.timeEnd('update-render-time');
            console.groupEnd();
          }
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this._store.unsubscribe(this._handleStoreChange);
        }
      }, {
        key: 'render',
        value: function render() {
          var _this2 = this;

          return _react2.default.createElement(Component, _extends({
            ref: function ref(App) {
              return _this2.App = App;
            }
          }, this.props, {
            store: this._store
          }));
        }
      }]);

      return StoreContainer;
    }(_react2.default.Component), _class.childContextTypes = {
      store: _react2.default.PropTypes.object
    }, _temp;
  };
}
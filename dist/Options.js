"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

function noop() {}

var Options = _reactAddons2["default"].createClass({
  displayName: "Options",

  propTypes: {
    children: _reactAddons2["default"].PropTypes.array.isRequired,
    onMouseDown: _reactAddons2["default"].PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      onMouseDown: noop
    };
  },

  _handleMouseDown: function _handleMouseDown(event) {
    this.props.onMouseDown(event);
  },

  render: function render() {
    return _reactAddons2["default"].createElement(
      "div",
      { className: "react-choice-options",
        onMouseDown: this._handleMouseDown,
        onMouseUp: this._handleMouseUp },
      _reactAddons2["default"].createElement(
        "ul",
        { className: "react-choice-options__list" },
        this.props.children
      )
    );
  }
});

exports["default"] = Options;
module.exports = exports["default"];
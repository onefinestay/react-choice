'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function noop() {}

var OptionWrapper = _reactAddons2['default'].createClass({
  displayName: 'OptionWrapper',

  propTypes: {
    selected: _reactAddons2['default'].PropTypes.bool.isRequired,
    children: _reactAddons2['default'].PropTypes.object.isRequired,
    onHover: _reactAddons2['default'].PropTypes.func,
    onClick: _reactAddons2['default'].PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      onHover: noop,
      onClick: noop
    };
  },

  render: function render() {
    var _props = this.props;
    var selected = _props.selected;
    var children = _props.children;
    var onHover = _props.onHover;
    var onClick = _props.onClick;

    var classes = _classnames2['default']({
      'react-choice-option': true,
      'react-choice-option--selected': selected
    });

    return _reactAddons2['default'].createElement(
      'li',
      { className: classes,
        onMouseEnter: onHover.bind(null, children),
        onMouseDown: onClick.bind(null, children),
        onTouchStart: onClick.bind(null, children)
      },
      children
    );
  }
});

exports['default'] = OptionWrapper;
module.exports = exports['default'];
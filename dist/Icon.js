'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Icon = _reactAddons2['default'].createClass({
  displayName: 'Icon',

  propTypes: {
    focused: _reactAddons2['default'].PropTypes.bool.isRequired
  },

  render: function render() {
    var focused = this.props.focused;

    var arrowClasses = (0, _classnames2['default'])({
      'react-choice-icon__arrow': true,
      'react-choice-icon__arrow--up': focused,
      'react-choice-icon__arrow--down': !focused
    });

    return _reactAddons2['default'].createElement('div', { className: arrowClasses });
  }
});

exports['default'] = Icon;
module.exports = exports['default'];
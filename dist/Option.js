'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _reactHighlighter = require('react-highlighter');

var _reactHighlighter2 = _interopRequireDefault(_reactHighlighter);

//
// Select option
//
var Option = _reactAddons2['default'].createClass({
  displayName: 'Option',

  mixins: [_reactAddons2['default'].addons.PureRenderMixin],

  propTypes: {
    children: _reactAddons2['default'].PropTypes.string.isRequired,
    query: _reactAddons2['default'].PropTypes.string
  },

  render: function render() {
    var _props = this.props;
    var query = _props.query;
    var children = _props.children;

    return _reactAddons2['default'].createElement(
      'div',
      null,
      _reactAddons2['default'].createElement(
        _reactHighlighter2['default'],
        { search: query },
        children
      )
    );
  }
});

exports['default'] = Option;
module.exports = exports['default'];
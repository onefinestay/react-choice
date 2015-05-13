"use strict";

var React = require("react/addons");

var Options = React.createClass({
  displayName: "Options",

  propTypes: {
    children: React.PropTypes.array.isRequired,
    onMouseDown: React.PropTypes.func.isRequired
  },

  _handleMouseDown: function _handleMouseDown(event) {
    this.props.onMouseDown(event);
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "react-choice-options",
        onMouseDown: this._handleMouseDown,
        onMouseUp: this._handleMouseUp },
      React.createElement(
        "ul",
        { className: "react-choice-options__list" },
        this.props.children
      )
    );
  }
});

module.exports = Options;
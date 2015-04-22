"use strict";

var React = require('react/addons');

var Options = React.createClass({
  propTypes: {
    children: React.PropTypes.array.isRequired,
    onMouseDown: React.PropTypes.func.isRequired
  },

  _handleMouseDown: function(event) {
    this.props.onMouseDown(event);
  },

  render: function() {
    return (
      <div className="react-choice-options"
        onMouseDown={this._handleMouseDown}
        onMouseUp={this._handleMouseUp}>
        <ul className="react-choice-options__list">
          {this.props.children}
        </ul>
      </div>
    );
  }
});

module.exports = Options;

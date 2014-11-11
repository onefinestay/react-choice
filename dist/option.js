"use strict";

var React = require('react/addons');
var cx = React.addons.classSet;

var TextHighlight = require('./text-highlight');

//
// Select option
//
var SelectOption = React.createClass({displayName: 'SelectOption',
  propTypes: {
    tokens: React.PropTypes.array.isRequired,
  },

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(TextHighlight, {tokens: this.props.tokens}, 
          this.props.children
        )
      )
    );
  }
});

module.exports = SelectOption;

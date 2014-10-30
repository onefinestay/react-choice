"use strict";

var React = require('react/addons');
var cx = React.addons.classSet;

var TextHighlight = require('./text-highlight');

//
// Search result
//
var SearchResult = React.createClass({displayName: 'SearchResult',
  propTypes: {
    label: React.PropTypes.string.isRequired,
  },

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(TextHighlight, {text: this.props.label, tokens: this.props.tokens})
      )
    );
  }
});

module.exports = SearchResult;

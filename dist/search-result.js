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
    tokens: React.PropTypes.array.isRequired,
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    if (this.props.tokens !== nextProps.tokens) {
      return true;
    }

    if (this.props.selected !== nextProps.selected) {
      return true;
    }

    return false;
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

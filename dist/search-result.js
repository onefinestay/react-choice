"use strict";

var React = require('react/addons');
var cx = React.addons.classSet;

var TextHighlight = require('./text-highlight');

//
// Search result
//
var SearchResult = React.createClass({displayName: 'SearchResult',
  propTypes: {
    selected: React.PropTypes.bool,
    onHover: React.PropTypes.func.isRequired,
    onClick: React.PropTypes.func.isRequired,
    label: React.PropTypes.string.isRequired,
    option: React.PropTypes.object.isRequired,
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
    var classes = cx({
      'select-result': true,
      'selected': !!this.props.selected
    });

    return (
      React.createElement("li", {className: classes, 
        onMouseEnter: this.props.onHover.bind(null, this.props.option), 
        onMouseDown: this.props.onClick.bind(null, this.props.option)}, 
        React.createElement(TextHighlight, {text: this.props.label, tokens: this.props.tokens})
      )
    );
  }
});

module.exports = SearchResult;

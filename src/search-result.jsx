"use strict";

var React = require('react/addons');
var cx = React.addons.classSet;

var TextHighlight = require('./text-highlight');

//
// Search result
//
var SearchResult = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
  },

  render: function() {
    return (
      <div>
        <TextHighlight text={this.props.label} tokens={this.props.tokens} />
      </div>
    );
  }
});

module.exports = SearchResult;

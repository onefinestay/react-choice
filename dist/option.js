"use strict";

var React = require('react/addons');
var cx = React.addons.classSet;

var OptionMixin = require('./option-mixin');
var TextHighlight = require('./text-highlight');

//
// Select option
//
var SelectOption = React.createClass({displayName: 'SelectOption',
  mixins: [OptionMixin],

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

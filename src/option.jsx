"use strict";

var React = require('react/addons');
var cx = React.addons.classSet;

var OptionMixin = require('./option-mixin');
var TextHighlight = require('./text-highlight');

//
// Select option
//
var SelectOption = React.createClass({
  mixins: [OptionMixin],

  render: function() {
    return (
      <div>
        <TextHighlight tokens={this.props.tokens}>
          {this.props.children}
        </TextHighlight>
      </div>
    );
  }
});

module.exports = SelectOption;

"use strict";

var React = require('react/addons');
var cx = React.addons.classSet;

var Icon = React.createClass({displayName: 'Icon',
  propTypes: {
    focused: React.PropTypes.bool.isRequired
  },

  render: function() {
    var arrowClasses = cx({
      'react-choice-icon__arrow': true,
      'react-choice-icon__arrow--up': this.props.focused,
      'react-choice-icon__arrow--down': !this.props.focused
    });

    return (
      React.createElement("div", {className: arrowClasses})
    );
  }
});

module.exports = Icon;

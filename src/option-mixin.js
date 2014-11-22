"use strict";

var React = require('react/addons');

var OptionMixin = {
  propTypes: {
    tokens: React.PropTypes.array.isRequired,
    children: React.PropTypes.string.isRequired
  }
};

module.exports = OptionMixin;

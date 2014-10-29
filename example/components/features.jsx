/** @jsx React.DOM */
"use strict";

var React = require('react/addons');

var Features = React.createClass({
  render: function() {
    return (
      <div className="features">
        <h2>Features</h2>
        <ul className="features__list">
        </ul>
      </div>
    );
  }
});

module.exports = Features;

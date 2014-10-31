"use strict";

var React = require('react/addons');

var Features = React.createClass({
  render: function() {
    return (
      <div className="features">
        <h2 className="features__header">Features</h2>
        <ul className="features__list">
          <li className="features__point">
            Search text highlighting
          </li>
          <li className="features__point">
            Single or multiple selection
          </li>
          <li className="features__point">
            Custom results rendering
          </li>
        </ul>
      </div>
    );
  }
});

module.exports = Features;

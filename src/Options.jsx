import React from 'react/addons';

function noop() {}

const Options = React.createClass({
  propTypes: {
    children: React.PropTypes.array.isRequired,
    onMouseDown: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      onMouseDown: noop,
    };
  },

  _handleMouseDown(event) {
    this.props.onMouseDown(event);
  },

  render() {
    return (
      <div className="react-choice-options"
        onMouseDown={this._handleMouseDown}
        onMouseUp={this._handleMouseUp}>
        <ul className="react-choice-options__list">
          {this.props.children}
        </ul>
      </div>
    );
  }
});

export default Options;

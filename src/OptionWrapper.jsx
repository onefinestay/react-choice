import React from 'react/addons';
import cx from 'classnames';

function noop() {}

const OptionWrapper = React.createClass({
  propTypes: {
    selected: React.PropTypes.bool.isRequired,
    children: React.PropTypes.object.isRequired,
    onHover: React.PropTypes.func,
    onClick: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      onHover: noop,
      onClick: noop
    };
  },

  render() {
    const {selected, children, onHover, onClick} = this.props;

    const classes = cx({
      'react-choice-option': true,
      'react-choice-option--selected': selected
    });

    return (
      <li className={classes}
        onMouseEnter={onHover.bind(null, children)}
        onMouseDown={onClick.bind(null, children)}
        onTouchStart={onClick.bind(null, children)}
      >
        {children}
      </li>
    );
  }
});

export default OptionWrapper;

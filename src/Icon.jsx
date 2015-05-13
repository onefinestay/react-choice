import React from 'react/addons';
import cx from 'classnames';

const Icon = React.createClass({
  propTypes: {
    focused: React.PropTypes.bool.isRequired
  },

  render() {
    const {focused} = this.props;

    const arrowClasses = cx({
      'react-choice-icon__arrow': true,
      'react-choice-icon__arrow--up': focused,
      'react-choice-icon__arrow--down': !focused
    });

    return (
      <div className={arrowClasses}></div>
    );
  }
});

export default Icon;

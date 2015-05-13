import React from 'react/addons';
import Highlight from 'react-highlighter';

//
// Select option
//
const Option = React.createClass({
  propTypes: {
    query: React.PropTypes.string.isRequired,
    children: React.PropTypes.string.isRequired
  },

  render() {
    const {query, children} = this.props;

    return (
      <div>
        <Highlight search={query}>
          {children}
        </Highlight>
      </div>
    );
  }
});

export default Option;

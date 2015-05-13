import React from 'react/addons';
import Highlight from 'react-highlighter';

//
// Select option
//
const Option = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    children: React.PropTypes.string.isRequired,
    query: React.PropTypes.string
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

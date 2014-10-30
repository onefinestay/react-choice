"use strict";

var _ = require('lodash');
var Sifter = require('sifter');

var SearchMixin = {
  //
  // Public methods
  //
  focus: function(openOptions) {
    this.refs.input.getDOMNode().focus();
  },

  _handleInput: function(event) {
    var keys = {
      13: this._enter,
      38: this._moveUp,
      40: this._moveDown,
      8: this._remove
    };

    if (_.contains(_.keys(keys), event.keyCode + "")) {
      if (typeof keys[event.keyCode] == 'function') {
        keys[event.keyCode](event);
      }
    }
  },

  _handleChange: function(event) {
    event.preventDefault();

    var query = event.target.value;

    var searcher = new Sifter(this.props.options);

    var result = searcher.search(query, {
      fields: this.props.searchField
    });

    var options = _.map(result.items, function(res) {
      return this.props.options[res.id];
    }, this);

    var highlighted = _.first(options);

    this.setState({
      value: query,
      options: options,
      searchTokens: result.tokens,
      highlighted: highlighted,
      selected: null,
    });
  },

  _handleFocus: function(event) {
    event.preventDefault();

    var highlighted;
    if (this.state.selected) {
      highlighted = _.find(this.state.options, function(option) {
        return option[this.props.valueField] == this.state.selected[this.props.valueField];
      }, this);
    } else {
      highlighted = _.first(this.state.options);
    }

    this.setState({
      focus: true,
      highlighted: highlighted
    });
  },

  _handleBlur: function(event) {
    event.preventDefault();
    this.setState({
      focus: false
    });
  },

  _handleOptionHover: function(option, event) {
    event.preventDefault();
    this.setState({
      highlighted: option
    });
  },

  _handleOptionClick: function(option, event) {
    event.preventDefault();
    this._selectOption(option);
  },

  _moveUp: function(event) {
    var options = this.state.options;
    if (options.length > 0) {
      event.preventDefault();
      var index = _.indexOf(options, this.state.highlighted);
      if (!_.isUndefined(options[index - 1])) {
        this.setState({
          highlighted: options[index - 1]
        });
      }
    }
  },

  _moveDown: function(event) {
    var options = this.state.options;
    if (options.length > 0) {
      event.preventDefault();
      var index = _.indexOf(options, this.state.highlighted);
      if (!_.isUndefined(options[index + 1])) {
        this.setState({
          highlighted: options[index + 1]
        });
      }
    }
  },

  _enter: function(event) {
    event.preventDefault();
    this._selectOption(this.state.highlighted);
  },

  _updateScrollPosition: function() {
    var highlighted = this.refs.highlighted;
    if (highlighted) {
      // find if highlighted option is not visible
      var el = highlighted.getDOMNode();
      var parent = this.refs.options.getDOMNode();
      var offsetTop = el.offsetTop + el.clientHeight - parent.scrollTop;

      // scroll down
      if (offsetTop > parent.clientHeight) {
        var diff = el.offsetTop + el.clientHeight - parent.clientHeight;
        parent.scrollTop = diff;
      } else if (offsetTop - el.clientHeight < 0) { // scroll up
        parent.scrollTop = el.offsetTop;
      }
    }
  },

  _resetSearch: function() {
    this.setState({
      value: '',
      options: this.props.options,
      searchTokens: [],
    });
  },
};

module.exports = SearchMixin;

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
      37: this._moveLeft,
      38: this._moveUp,
      39: this._moveRight,
      40: this._moveDown,
      8: this._remove
    };

    if (typeof keys[event.keyCode] == 'function') {
      keys[event.keyCode](event);
    }
  },

  _handleChange: function(event) {
    event.preventDefault();

    var query = event.target.value;

    var options = this.state.options;

    var searcher = new Sifter(options);

    var result = searcher.search(query, {
      fields: this.props.searchField
    });

    var searchResults = _.map(result.items, function(res) {
      return options[res.id];
    });

    var highlighted = _.first(searchResults);

    this.setState({
      value: query,
      searchResults: searchResults,
      searchTokens: result.tokens,
      highlighted: highlighted,
      selected: null,
    });
  },

  _handleFocus: function(event) {
    event.preventDefault();

    var highlighted;
    if (this.state.selected) {
      highlighted = _.find(this.state.searchResults, function(option) {
        return option[this.props.valueField] == this.state.selected[this.props.valueField];
      }, this);
    } else {
      highlighted = _.first(this.state.searchResults);
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
    var options = this.state.searchResults;
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
    var options = this.state.searchResults;
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
      searchResults: this.state.options,
      searchTokens: [],
      highlighted: _.first(this.state.options)
    });
  },
};

module.exports = SearchMixin;

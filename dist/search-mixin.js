'use strict';

var _ = require('lodash');
var Sifter = require('sifter');

var SearchMixin = {
  //
  // Public methods
  //
  focus: function focus(openOptions) {
    this.refs.input.getDOMNode().focus();
  },

  _sort: function _sort(list) {
    if (typeof this.props.sorter === 'function') {
      return this.props.sorter(list);
    }
    return _.sortBy(list, this.props.labelField);
  },

  _handleClick: function _handleClick(event) {
    this.refs.input.getDOMNode().focus();
  },

  _handleInput: function _handleInput(event) {
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

  _handleChange: function _handleChange(event) {
    event.preventDefault();

    var query = event.target.value;

    var options = this._getAvailableOptions();

    var searcher = new Sifter(options);

    var result = searcher.search(query, {
      fields: this.props.searchField
    });

    var searchResults = _.map(result.items, function (res) {
      return options[res.id];
    });

    var highlighted = _.first(searchResults);

    this.setState({
      value: query,
      searchResults: searchResults,
      searchTokens: result.tokens,
      highlighted: highlighted,
      selected: null });
  },

  _handleFocus: function _handleFocus(event) {
    event.preventDefault();

    var highlighted;
    if (this.state.selected) {
      highlighted = _.find(this.state.searchResults, function (option) {
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

  _handleOptionHover: function _handleOptionHover(option, event) {
    event.preventDefault();
    this.setState({
      highlighted: option
    });
  },

  _handleOptionClick: function _handleOptionClick(option, event) {
    event.preventDefault();
    event.stopPropagation();
    this._selectOption(option);
  },

  _moveUp: function _moveUp(event) {
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

  _moveDown: function _moveDown(event) {
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

  _enter: function _enter(event) {
    event.preventDefault();
    this._selectOption(this.state.highlighted);
  },

  _updateScrollPosition: function _updateScrollPosition() {
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
      } else if (offsetTop - el.clientHeight < 0) {
        // scroll up
        parent.scrollTop = el.offsetTop;
      }
    }
  },

  _resetSearch: function _resetSearch(options) {
    return {
      value: '',
      searchResults: options,
      searchTokens: [],
      highlighted: _.first(options)
    };
  } };

module.exports = SearchMixin;
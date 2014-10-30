"use strict";

var React = require('react/addons');
var _ = require('lodash');
var Sifter = require('sifter');
var cx = React.addons.classSet;

var SearchResult = require('./search-result');

//
// Auto complete select box
//
var SingleChoice = React.createClass({displayName: 'SingleChoice',
  propTypes: {
    name: React.PropTypes.string, // name of input
    placeholder: React.PropTypes.string, // input placeholder
    value: React.PropTypes.string, // initial value for input field

    valueField: React.PropTypes.string, // value field name
    labelField: React.PropTypes.string, // label field name

    searchField: React.PropTypes.array, // array of search fields

    options: React.PropTypes.array.isRequired, // array of objects
    resultRenderer: React.PropTypes.func, // search result React component

    onSelect: React.PropTypes.func, // function called when option is selected
  },

  getDefaultProps: function() {
    return {
      valueField: 'value',
      labelField: 'label',
      searchField: ['label'],
      resultRenderer: SearchResult,
    };
  },

  getInitialState: function() {
    var selected = null;
    if (this.props.value) {
      // find selected value
      selected = _.find(this.props.options, function(option) {
        return option[this.props.valueField] == this.props.value;
      }, this);
    }

    return {
      value: selected ? selected[this.props.labelField] : this.props.value,
      focus: false,
      options: this.props.options,
      highlighted: null,
      selected: selected,
      searchTokens: [],
    };
  },

  //
  // Public methods
  //
  focus: function(openOptions) {
    this.refs.input.getDOMNode().focus();
  },

  getValue: function() {
    return this.state.selected ?
      this.state.selected[this.props.valueField] : null;
  },

  //
  // Events
  //
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

  _handleArrowClick: function(event) {
    if (this.state.focus) {
      this._handleBlur(event);
      this.refs.input.getDOMNode().blur();
    } else {
      this._handleFocus(event);
      this.refs.input.getDOMNode().focus();
    }
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

  _remove: function(event) {
    if (this.state.selected) {
      event.preventDefault();
      this.setState({
        value: '',
        selected: null,
        highlighted: _.first(this.props.options),
        focus: true,
        options: this.props.options
      });
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

  _selectOption: function(option) {
    this.refs.input.getDOMNode().blur();

    if (option) {
      this.setState({
        selected: option,
      });
      this._resetSearch();

      if (typeof this.props.onSelect === 'function') {
        this.props.onSelect(option);
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

  componentDidMount: function() {
    this._updateScrollPosition();
  },

  componentDidUpdate: function() {
    this._updateScrollPosition();

    if (this.state.selected && this.state.focus) {
      setTimeout(function() {
        this.refs.input.getDOMNode().select();
      }.bind(this), 50);
    }
  },

  render: function() {
    var options = _.map(this.state.options, function(option) {
      var value = option[this.props.valueField];

      var highlighted = this.state.highlighted &&
        value == this.state.highlighted[this.props.valueField];

      var Renderer = React.createFactory(this.props.resultRenderer);

      return Renderer({
        key: value,
        value: value,
        label: option[this.props.labelField],
        option: option,
        tokens: this.state.searchTokens,
        selected: highlighted,
        ref: highlighted ? 'highlighted' : null,
        onHover: this._handleOptionHover,
        onClick: this._handleOptionClick,
      });
    }, this);

    var value = this.state.selected ?
      this.state.selected[this.props.valueField] : null;
    var label = this.state.selected ?
      this.state.selected[this.props.labelField] : this.state.value;

    var classes = cx({
      'react-choice': true,
    });

    var inputClasses = cx({
      'react-choice-input': true,
      'react-choice-input--in-focus': this.state.focus,
      'react-choice-input--not-in-focus': !this.state.focus
    });

    var arrowClasses = cx({
      'react-choice-icon__arrow': true,
      'react-choice-icon__arrow--up': this.state.focus,
      'react-choice-icon__arrow--down': !this.state.focus
    });

    return (
      React.createElement("div", {className: "react-choice"}, 
        React.createElement("input", {type: "hidden", name: this.props.name, value: value}), 

        React.createElement("input", {type: "text", 
          className: inputClasses, 
          placeholder: this.props.placeholder, 
          value: label, 

          onKeyDown: this._handleInput, 
          onChange: this._handleChange, 
          onFocus: this._handleFocus, 
          onBlur: this._handleBlur, 

          autoComplete: "off", 
          ref: "input"}), 

        React.createElement("div", {className: "react-choice-icon", onMouseDown: this._handleArrowClick}, 
          React.createElement("div", {className: arrowClasses})
        ), 

        this.state.focus ?
          React.createElement("div", {className: "react-choice-options", ref: "options"}, 
            React.createElement("ul", {className: "react-choice-options__list"}, 
              options
            )
          ) : null
      )
    );
  }
});

module.exports = SingleChoice;

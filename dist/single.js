"use strict";

var React = require('react/addons');
var _ = require('lodash');
var cx = React.addons.classSet;

var SearchResult = require('./search-result');
var OptionWrapper = require('./option-wrapper');

var SearchMixin = require('./search-mixin');

//
// Auto complete select box
//
var SingleChoice = React.createClass({displayName: 'SingleChoice',
  mixins: [SearchMixin],

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

  _getAvailableOptions: function() {
    var options = this.props.options;

    return this._sort(options);
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
      searchResults: this._sort(this.props.options),
      highlighted: null,
      selected: selected,
      searchTokens: [],
    };
  },

  //
  // Public methods
  //
  getValue: function() {
    return this.state.selected ?
      this.state.selected[this.props.valueField] : null;
  },

  //
  // Events
  //
  _handleArrowClick: function(event) {
    if (this.state.focus) {
      this._handleBlur(event);
      this.refs.input.getDOMNode().blur();
    } else {
      this._handleFocus(event);
      this.refs.input.getDOMNode().focus();
    }
  },

  _remove: function(event) {
    if (this.state.selected) {
      event.preventDefault();

      var state = this._resetSearch(this.props.options);
      state.selected = null;

      this.setState(state);
    }
  },

  _selectOption: function(option) {
    this.refs.input.getDOMNode().blur();

    if (option) {
      var state = this._resetSearch(this.props.options);
      state.selected = option;

      this.setState(state);

      if (typeof this.props.onSelect === 'function') {
        this.props.onSelect(option);
      }
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.value !== this.props.value) {
      var options = this._getAvailableOptions();

      var selected = _.find(options, function(option) {
        return option[this.props.valueField] == nextProps.value;
      }, this);

      var state = this._resetSearch(options);
      state.value = selected ? selected[this.props.labelField] : nextProps.value;
      state.selected = selected;

      this.setState(state);
    }
  },

  componentDidUpdate: function() {
    this._updateScrollPosition();

    // select selected text in input box
    if (this.state.selected && this.state.focus) {
      setTimeout(function() {
        this.refs.input.getDOMNode().select();
      }.bind(this), 50);
    }
  },

  render: function() {
    var options = _.map(this.state.searchResults, function(option) {
      var value = option[this.props.valueField];

      var highlighted = this.state.highlighted &&
        value == this.state.highlighted[this.props.valueField];

      var Renderer = this.props.resultRenderer;

      return (
        React.createElement(OptionWrapper, {key: value, 
          selected: highlighted, 
          ref: highlighted ? 'highlighted' : null, 
          option: option, 
          onHover: this._handleOptionHover, 
          onClick: this._handleOptionClick}, 
          React.createElement(Renderer, {
            value: value, 
            label: option[this.props.labelField], 
            option: option, 
            tokens: this.state.searchTokens})
        )
      );
    }, this);

    var value = this.state.selected ?
      this.state.selected[this.props.valueField] : null;
    var label = this.state.selected ?
      this.state.selected[this.props.labelField] : this.state.value;

    var wrapperClasses = cx({
      'react-choice-wrapper': true,
      'react-choice-single': true,
      'react-choice-single--in-focus': this.state.focus,
      'react-choice-single--not-in-focus': !this.state.focus
    });

    var arrowClasses = cx({
      'react-choice-icon__arrow': true,
      'react-choice-icon__arrow--up': this.state.focus,
      'react-choice-icon__arrow--down': !this.state.focus
    });

    return (
      React.createElement("div", {className: "react-choice"}, 
        React.createElement("input", {type: "hidden", name: this.props.name, value: value}), 

        React.createElement("div", {className: wrapperClasses, onClick: this._handleClick}, 
          React.createElement("input", {type: "text", 
            className: "react-choice-input react-choice-single__input", 
            placeholder: this.props.placeholder, 
            value: label, 

            onKeyDown: this._handleInput, 
            onChange: this._handleChange, 
            onFocus: this._handleFocus, 
            onBlur: this._handleBlur, 

            autoComplete: "off", 
            ref: "input"})
        ), 

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

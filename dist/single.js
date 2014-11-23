"use strict";

var React = require('react/addons');
var _ = require('lodash');
var cx = React.addons.classSet;
var cloneWithProps = React.addons.cloneWithProps;

var LazyRender = require('../lib/lazy-render');

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

    onSelect: React.PropTypes.func, // function called when option is selected
  },

  getDefaultProps: function() {
    return {
      valueField: 'value',
      labelField: 'children',
      searchField: ['children']
    };
  },

  _getAvailableOptions: function() {
    var options = this.state.initialOptions;

    return this._sort(options);
  },

  getInitialState: function() {
    var selected = null;

    var props = this.props.searchField;
    props.push(this.props.valueField);
    props.push(this.props.searchField);
    props = _.uniq(props);

    var options = _.map(this.props.children, function(child) {
      // TODO Validation ?
      return _.pick(child.props, props);
    }, this);

    if (this.props.value) {
      // find selected value
      selected = _.find(options, function(option) {
        return option[this.props.valueField] == this.props.value;
      }, this);
    }

    return {
      value: selected ? selected[this.props.labelField] : this.props.value,
      focus: false,
      searchResults: this._sort(options),
      initialOptions: options,
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

      var state = this._resetSearch(this.state.initialOptions);
      state.selected = null;

      this.setState(state);
    }
  },

  _selectOption: function(option) {
    this.refs.input.getDOMNode().blur();

    if (option) {
      var options = this._getAvailableOptions();
      var state = this._resetSearch(options);
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
      var valueField = this.props.valueField;
      var value = option[valueField];

      var child = _.find(this.props.children, function(child) {
        return child.props[valueField] == value;
      });

      var highlighted = this.state.highlighted &&
        value == this.state.highlighted[valueField];

      child = cloneWithProps(child, { tokens: this.state.searchTokens });

      return (
        React.createElement(OptionWrapper, {
          selected: highlighted, 
          option: option, 
          onHover: this._handleOptionHover, 
          onClick: this._handleOptionClick}, 
          child
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
            React.createElement(LazyRender, {maxHeight: 300, className: "react-choice-options__list"}, 
              options
            )
          ) : null
      )
    );
  }
});

module.exports = SingleChoice;

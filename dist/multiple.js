"use strict";

var React = require('react/addons');
var _ = require('lodash');
var Sifter = require('sifter');
var cx = React.addons.classSet;

var SearchResult = require('./search-result');
var OptionWrapper = require('./option-wrapper');

var SearchMixin = require('./search-mixin');

var ValueWrapper = React.createClass({displayName: 'ValueWrapper',
  render: function() {
    var classes = cx({
      'react-choice-value': true,
      'react-choice-value--is-selected': this.props.selected
    });

    return (
      React.createElement("div", {className: classes}, 
        this.props.children
      )
    );
  }
});

var MultipleChoice = React.createClass({displayName: 'MultipleChoice',
  mixins: [SearchMixin],

  propTypes: {
    name: React.PropTypes.string, // name of input
    placeholder: React.PropTypes.string, // input placeholder
    values: React.PropTypes.array, // initial values

    valueField: React.PropTypes.string, // value field name
    labelField: React.PropTypes.string, // label field name

    searchField: React.PropTypes.array, // array of search fields

    options: React.PropTypes.array.isRequired, // array of objects
    resultRenderer: React.PropTypes.func, // search result React component

    onSelect: React.PropTypes.func, // function called when option is selected
  },

  getDefaultProps: function() {
    return {
      values: [],
      valueField: 'value',
      labelField: 'label',
      searchField: ['label'],
      resultRenderer: SearchResult,
    };
  },

  getInitialState: function() {
    var options = this._sort(this.props.options);

    return {
      focus: false,
      options: options,
      searchResults: options,
      values: this.props.values,
      highlighted: null,
      selected: null,
      selectedValue: null,
      searchTokens: [],
    };
  },

  _sort: function(list) {
    if (typeof this.props.sorter === 'function') {
      return this.props.sorter(list);
    }
    return _.sortBy(list, this.props.labelField);
  },

  _handleClick: function(event) {
    this.refs.input.getDOMNode().focus();
  },

  _handleContainerInput: function(event) {
    var keys = {
      37: this._moveLeft,
      39: this._moveRight,
      8: this._removeContainer
    };

    if (typeof keys[event.keyCode] == 'function') {
      keys[event.keyCode](event);
    }
  },

  _handleContainerBlur: function(event) {
    if (this.state.selectedValue) {
      this.setState({
        selectedValue: null
      });
    }
  },

  _selectOption: function(option) {
    if (option) {
      var values = this.state.values;
      values.push(option);

      var valueField = this.props.valueField;

      var options = _.filter(this.props.options, function(option) {
        var index = _.findIndex(values, function(value) {
          return value[valueField] == option[valueField];
        });
        return index === -1;
      });

      this.setState({
        values: values,
        options: options,
        value: '',
        searchResults: options,
        searchTokens: [],
        highlighted: _.first(options)
      });

      if (typeof this.props.onSelect === 'function') {
        this.props.onSelect(option);
      }
    }
  },

  _moveLeft: function(event) {
    var input = this.refs.input.getDOMNode();

    if (!this.state.values.length) {
      return false;
    }

    if (
      event.target == input &&
      event.target.selectionStart === 0
    ) {
      event.preventDefault();

      // select stage
      this.setState({
        selectedValue: _.last(this.state.values)
      });

      // focus on container
      this.refs.container.getDOMNode().focus();
    } else {
      // select previous value
      var index = _.indexOf(this.state.values, this.state.selectedValue);
      var prevValue = this.state.values[index - 1];
      if (!_.isUndefined(prevValue)) {
        this.setState({
          selectedValue: prevValue
        });
      }
    }
  },

  _moveRight: function(event) {
    var input = this.refs.input.getDOMNode();

    if (!this.state.values.length) {
      return false;
    }

    if (this.state.selectedValue) {
      // select next value
      var index = _.indexOf(this.state.values, this.state.selectedValue);
      var nextValue = this.state.values[index + 1];
      if (!_.isUndefined(nextValue)) {
        this.setState({
          selectedValue: nextValue
        });
      } else {
        // focus input box
        this.refs.input.getDOMNode().focus();
      }
    }
  },

  _removeValue: function(value) {
    var values = _.without(this.state.values, value);

    var options = this.state.options;
    options.push(value);
    options = this._sort(options);

    return {
      options: options,
      values: values,
      value: '',
      searchResults: options,
      searchTokens: [],
      highlighted: _.first(options)
    };
  },

  _remove: function(event) {
    if (!this.state.value) {
      // remove latest value
      event.preventDefault();

      // remove last stage
      if (this.state.values.length) {
        var valueToRemove = _.last(this.state.values);
        this.setState(this._removeValue(valueToRemove));
      }
    }
  },

  _removeContainer: function(event) {
    if (this.state.selectedValue) {
      event.preventDefault();
      var state = this._removeValue(this.state.selectedValue);
      // find next value
      var index = _.indexOf(this.state.values, this.state.selectedValue);
      var nextValue = state.values[index];
      if (!_.isUndefined(nextValue)) {
        state.selectedValue = nextValue;
      } else {
        // focus input
        this.refs.input.getDOMNode().focus();
      }
      this.setState(state);
    }
  },

  componentDidUpdate: function() {
    this._updateScrollPosition();
  },

  render: function() {
    var values = _.map(this.state.values, function(value) {
      var key = value[this.props.valueField];

      var selectedValue = this.state.selectedValue;

      var selected = (
        selectedValue &&
        selectedValue[this.props.valueField] == key
      );

      var label = value[this.props.labelField];

      return (
        React.createElement(ValueWrapper, {key: key, 
          onClick: this._selectValue, 
          selected: selected}, 
          React.createElement("div", null, label)
        )
      );
    }, this);

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

    var label = this.state.value;

    var wrapperClasses = cx({
      'react-choice-wrapper': true,
      'react-choice-multiple': true,
      'react-choice-multiple--in-focus': this.state.focus,
      'react-choice-multiple--not-in-focus': !this.state.focus
    });

    return (
      React.createElement("div", {className: "react-choice"}, 
        React.createElement("div", {className: wrapperClasses, onClick: this._handleClick, 
          tabIndex: "-1", ref: "container", onKeyDown: this._handleContainerInput, 
          onBlur: this._handleContainerBlur}, 
          values, 
          React.createElement("input", {type: "text", 
            placeholder: this.props.placeholder, 
            value: label, 
            className: "react-choice-input react-choice-multiple__input", 

            onKeyDown: this._handleInput, 
            onChange: this._handleChange, 
            onFocus: this._handleFocus, 
            onBlur: this._handleBlur, 

            autoComplete: "off", 
            ref: "input"})
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

module.exports = MultipleChoice;

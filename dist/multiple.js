"use strict";

var React = require('react/addons');
var _ = require('lodash');
var Sifter = require('sifter');
var cx = React.addons.classSet;

var SearchResult = require('./search-result');
var OptionWrapper = require('./option-wrapper');

var SearchMixin = require('./search-mixin');

var ValueWrapper = React.createClass({displayName: 'ValueWrapper',
  propTypes: {
    onClick: React.PropTypes.func.isRequired,
    onDeleteClick: React.PropTypes.func.isRequired,
  },

  onDeleteClick: function(event) {
    event.stopPropagation();
    this.props.onDeleteClick(event);
  },

  render: function() {
    var classes = cx({
      'react-choice-value': true,
      'react-choice-value--is-selected': this.props.selected
    });

    return (
      React.createElement("div", {className: classes, onClick: this.props.onClick}, 
        React.createElement("div", {className: "react-choice-value__children"}, this.props.children), 
        React.createElement("a", {className: "react-choice-value__delete", onClick: this.onDeleteClick}, "x")
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
    allowDuplicates: React.PropTypes.bool, // if true, the same values can be added multiple times
  },

  getDefaultProps: function() {
    return {
      values: [],
      valueField: 'value',
      labelField: 'label',
      searchField: ['label'],
      resultRenderer: SearchResult,
      allowDuplicates: false,
    };
  },

  getInitialState: function() {
    return {
      focus: false,
      searchResults: this.props.options,
      values: this.props.values,
      highlighted: null,
      selected: null,
      selectedIndex: -1,
      searchTokens: [],
    };
  },

  _handleClick: function(event) {
    this.refs.input.getDOMNode().focus();
  },

  _handleContainerInput: function(event) {
    var keys = {
      37: this._moveLeft,
      39: this._moveRight,
      8: this._removeSelectedContainer
    };

    if (typeof keys[event.keyCode] == 'function') {
      keys[event.keyCode](event);
    }
  },

  _handleContainerBlur: function(event) {
    if (this.state.selectedIndex) {
      this.setState({
        selectedIndex: -1
      });
    }
  },

  _selectOption: function(option) {
    if (option) {
      var values = this.state.values.slice(0); // copy
      values.push(option);

      var state = this._resetSearch(values);
      state.values = values;

      this.setState(state);

      if (typeof this.props.onSelect === 'function') {
        this.props.onSelect(option);
      }
    }
  },

  _getAvailableOptions: function(values) {
    var options = this.props.options;
    var valueField = this.props.valueField;

    if (this.props.allowDuplicates === false && values) {
      options = _.filter(options, function(option) {
        var found = _.find(values, function(value) {
          return value[valueField] === option[valueField];
        });

        return typeof found === 'undefined';
      });
    }

    return this._sort(options);
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
        selectedIndex: this.state.values.length - 1
      });

      // focus on container
      this.refs.container.getDOMNode().focus();
    } else if (this.state.selectedIndex !== -1) {
      var nextIndex = this.state.selectedIndex - 1;
      if (nextIndex > -1) {
        this.setState({
          selectedIndex: nextIndex
        });
      }
    }
  },

  _moveRight: function(event) {
    var input = this.refs.input.getDOMNode();

    if (!this.state.values.length) {
      return false;
    }

    if (this.state.selectedIndex !== -1) {
      var nextIndex = this.state.selectedIndex + 1;
      if (nextIndex < this.state.values.length) {
        this.setState({
          selectedIndex: nextIndex
        });
      } else {
        // focus input box
        this.refs.input.getDOMNode().focus();
        this.setState({
          selectedIndex: -1
        })
      }
    }
  },

  _removeValue: function(index) {
    var values = this.state.values.slice(0); // copy
    values.splice(index, 1);

    var state = this._resetSearch(values);
    state.values = values;

    this.setState(state);
  },

  // removes last element
  _remove: function(event) {
    if (!this.state.value) {
      event.preventDefault();

      // remove last stage
      if (this.state.values.length) {
        this._removeValue(this.state.values.length - 1);
      }
    }
  },

  // called from within, removes selected element
  _removeSelectedContainer: function(event) {
    if (this.state.selectedIndex !== -1) {
      event.preventDefault();

      // move selection to the element before the removed one (gmail behavior)
      this.setState({
        selectedIndex: this.state.selectedIndex - 1
      });

      this._removeValue(this.state.selectedIndex);
    }
  },

  _removeDeletedContainer: function(index) {
    this._removeValue(index);
  },

  _selectValue: function(index, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({
      selectedIndex: index
    });

    this.refs.container.getDOMNode().focus();
  },

  componentDidUpdate: function() {
    this._updateScrollPosition();
  },

  render: function() {
    var values = _.map(this.state.values, function(value, i) {
      var key = value[this.props.valueField];

      var selected = i === this.state.selectedIndex;

      var label = value[this.props.labelField];

      return (
        React.createElement(ValueWrapper, {key: i, 
          onClick: this._selectValue.bind(null, i), 
          onDeleteClick: this._removeDeletedContainer.bind(null, i), 
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

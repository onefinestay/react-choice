"use strict";

var React = require('react/addons');
var _ = require('lodash');
var Sifter = require('sifter');
var cx = React.addons.classSet;

var SearchResult = require('./search-result');
var OptionWrapper = require('./option-wrapper');

var SearchMixin = require('./search-mixin');

var ValueWrapper = React.createClass({
  render: function() {
    return (
      <div className="react-choice-value">
        {this.props.children}
      </div>
    );
  }
});

var MultipleChoice = React.createClass({
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
    return {
      focus: false,
      options: this.props.options,
      values: this.props.values,
      highlighted: null,
      selected: null,
      selectedValue: null,
      searchTokens: [],
    };
  },

  _handleClick: function(event) {
    this.refs.input.getDOMNode().focus();
  },

  _selectOption: function(option) {
    /*
    this.refs.input.getDOMNode().blur();
    // TODO focus container
    this.refs.container.getDOMNode().focus();
     */

    if (option) {
      var values = this.state.values;

      // TODO remove from available options

      values.push(option);

      this.setState({
        values: values
      });
      this._resetSearch();

      if (typeof this.props.onSelect === 'function') {
        this.props.onSelect(option);
      }
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
        <ValueWrapper key={key}
          onClick={this._selectValue}
          selected={selected}>
          <div>{label}</div>
        </ValueWrapper>
      );
    }, this);

    var options = _.map(this.state.options, function(option) {
      var value = option[this.props.valueField];

      var highlighted = this.state.highlighted &&
        value == this.state.highlighted[this.props.valueField];

      var Renderer = this.props.resultRenderer;

      return (
        <OptionWrapper key={value}
          selected={highlighted}
          ref={highlighted ? 'highlighted' : null}
          option={option}
          onHover={this._handleOptionHover}
          onClick={this._handleOptionClick}>
          <Renderer
            value={value}
            label={option[this.props.labelField]}
            option={option}
            tokens={this.state.searchTokens}/>
        </OptionWrapper>
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
      <div className="react-choice" ref="container">
        <div className={wrapperClasses} onClick={this._handleClick}>
          {values}
          <input type="text"
            placeholder={this.props.placeholder}
            value={label}
            className="react-choice-input react-choice-multiple__input"

            onKeyDown={this._handleInput}
            onChange={this._handleChange}
            onFocus={this._handleFocus}
            onBlur={this._handleBlur}

            autoComplete="off"
            ref="input" />
        </div>

        {this.state.focus ?
          <div className="react-choice-options" ref="options">
            <ul className="react-choice-options__list">
              {options}
            </ul>
          </div> : null}
      </div>
    );
  }
});

module.exports = MultipleChoice;

import React from 'react/addons';
import _map from 'lodash.map';
import _find from 'lodash.find';
import cx from 'classnames';

import Icon from './icon';
import Options from './options';
import OptionWrapper from './OptionWrapper';

function noop() {}

function isDefined(value) {
  return typeof value !== 'undefined';
}

//
// Auto complete select box
//
const SingleChoice = React.createClass({
  propTypes: {
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    defaultValue: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),

    children: React.PropTypes.array.isRequired, // options

    name: React.PropTypes.string, // name of input
    placeholder: React.PropTypes.string, // input placeholder
    disabled: React.PropTypes.bool,

    valueField: React.PropTypes.string, // value field name
    labelField: React.PropTypes.string, // label field name

    searchField: React.PropTypes.array, // array of search fields

    icon: React.PropTypes.func, // icon render

    onSelect: React.PropTypes.func // function called when option is selected
  },

  getDefaultProps() {
    return {
      valueField: 'value',
      labelField: 'children',
      searchField: ['children'],
      onSelect: noop
    };
  },

  getInitialState() {
    return {
      focus: false,
      hoverValue: null
    };
  },

  _getSelectedValue() {
    var {value, defaultValue} = this.props;
    var {chosenValue} = this.state;

    // value property overrides all
    if (typeof value !== 'undefined') {
      return value;
    }

    if (typeof chosenValue !== 'undefined') {
      return chosenValue;
    }

    return defaultValue;
  },

  _getOption(value) {
    const {children, valueField} = this.props;
    return _find(children, (child) => child.props[valueField] === value);
  },

  _isActive() {
    return !this.props.disabled && this.state.focus;
  },

  //
  // Public methods
  //
  getValue() {
    return this.state.selected ?
      this.state.selected[this.props.valueField] : null;
  },

  //
  // Events
  //
  _handleClick: function(event) {
    event.preventDefault();
    this.refs.input.getDOMNode().focus();
  },

  // TODO
  _handleArrowClick(event) {
    debugger;
    if (this.state.focus) {
      this._handleBlur(event);
      this.refs.input.getDOMNode().blur();
    } else {
      this._handleFocus(event);
      this.refs.input.getDOMNode().focus();
    }
  },

  _handleFocus: function(event) {
    event.preventDefault();

    /*
    var highlighted;
    if (this.state.selected) {
      highlighted = _.find(this.state.searchResults, function(option) {
        return option[this.props.valueField] == this.state.selected[this.props.valueField];
      }, this);
    } else {
      highlighted = _.first(this.state.searchResults);
    }
     */

    this.setState({
      focus: true
    });
  },

  _remove(event) {
    if (this.state.selected) {
      event.preventDefault();

      var state = this._resetSearch(this.state.initialOptions);
      state.selected = null;

      this.setState(state);
    }
  },

  _selectOption(option) {
    // reset mousedown latch
    this._optionsMouseDown = false;
    this.refs.input.getDOMNode().blur();

    const {valueField} = this.props;

    this.setState({
      chosenValue: option.props[valueField],
      focus: false,
      hoverValue: null
    }, () => {
      // Try and replicate normal dom event
      var fakeEvent = {
        target: this.refs.input.getDOMNode(),
        option
      };
      this.props.onSelect(fakeEvent);
    });

    /*
    var options = this._getAvailableOptions();
    var state = this._resetSearch(options);
    state.selected = option;

    this.setState(state);
    this.props.onSelect(option);
     */
  },

  _handleBlur(event) {
    event.preventDefault();
    if (this._optionsMouseDown === true) {
      this._optionsMouseDown = false;
      this.refs.input.getDOMNode().focus();
      event.stopPropagation();
    } else {
      this.setState({
        focus: false
      });
    }
  },

  _handleOptionHover: function(child) {
    const {valueField} = this.props;

    this.setState({
      hoverValue: child.props[valueField]
    });
  },

  _handleOptionClick: function(child, event) {
    event.preventDefault();
    event.stopPropagation();

    this._selectOption(child);
  },

  _handleOptionsMouseDown() {
    // prevent windows issue where clicking on scrollbar triggers blur on input
    this._optionsMouseDown = true;
  },

  /*
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      var options = this._getAvailableOptions();

      var selected = _find(options, (option) => option[this.props.valueField] === nextProps.value);

      var state = this._resetSearch(options);
      state.value = selected ? selected[this.props.labelField] : nextProps.value;
      state.selected = selected;

      this.setState(state);
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.focus === false && this.state.focus === true) {
      this._updateScrollPosition();
    }

    // select selected text in input box
    if (this.state.selected && this.state.focus) {
      setTimeout(() => {
        if (this.isMounted()) {
          this.refs.input.getDOMNode().select();
        }
      }, 50);
    }
  },
   */

  render() {
    const {name, valueField, labelField, placeholder, children} = this.props;
    const {hoverValue} = this.state;

    const selectedValue = this._getSelectedValue();
    const selectedOption = (selectedValue !== null) ? this._getOption(selectedValue) : null;

    const options = _map(children, (child, index) => {
      const highlightedValue = isDefined(hoverValue) && hoverValue !== null ? hoverValue : selectedValue;

      const highlighted = (child.props[valueField] === highlightedValue);

      const key = `${index}-${child.props[valueField]}`;

      return (
        <OptionWrapper key={key}
          selected={highlighted}
          ref={highlighted ? 'highlighted' : null}
          onHover={this._handleOptionHover}
          onClick={this._handleOptionClick}>
          {child}
        </OptionWrapper>
      );
    });

    let label = selectedOption ? selectedOption.props[labelField] : null;

    const isActive = this._isActive();

    const wrapperClasses = cx({
      'react-choice-wrapper': true,
      'react-choice-single': true,
      'react-choice-single--in-focus': isActive,
      'react-choice-single--not-in-focus': !isActive
    });

    var IconRenderer = this.props.icon || Icon;

    return (
      <div className="react-choice">
        <input type="hidden" name={name}
          value={selectedValue}
          ref="input"/>

        <div className={wrapperClasses} onClick={this._handleClick}>
          <input type="text"
            className="react-choice-input react-choice-single__input"
            placeholder={placeholder}
            value={label}

            onKeyDown={this._handleInput}
            onChange={this._handleChange}
            onFocus={this._handleFocus}
            onBlur={this._handleBlur}

            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isActive}
            ref="input" />
        </div>

        <div className="react-choice-icon" onMouseDown={this._handleArrowClick}>
          <IconRenderer focused={isActive} />
        </div>

        {isActive ?
          <Options onMouseDown={this._handleOptionsMouseDown} ref="options">
            {options}
          </Options> : null}
      </div>
    );
  }
});

export default SingleChoice;

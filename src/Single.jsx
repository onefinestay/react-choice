import React from 'react/addons';
import _map from 'lodash.map';
import _find from 'lodash.find';
import _findIndex from 'lodash.findindex';
import _filter from 'lodash.filter';
import cx from 'classnames';

import Icon from './Icon';
import Options from './Options';
import OptionWrapper from './OptionWrapper';

const {cloneWithProps} = React.addons;

function noop() {}

function isDefined(value) {
  return typeof value !== 'undefined';
}

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

    icon: React.PropTypes.func, // icon render

    getSuggestions: React.PropTypes.func, // custom search function
    onSelect: React.PropTypes.func // function called when option is selected
  },

  //
  // Public methods
  //
  getValue() {
    return this.state.selected ?
      this.state.selected[this.props.valueField] : null;
  },

  //
  // Internal methods
  //
  getDefaultProps() {
    return {
      valueField: 'value',
      labelField: 'children',
      onSelect: noop
    };
  },

  getInitialState() {
    return {
      focus: false,
      chosenValue: null,
      hoverValue: null,
      searchQuery: null,
      searchResults: null
    };
  },

  _getSelectedValue() {
    var {value, defaultValue} = this.props;
    var {chosenValue} = this.state;

    if (typeof value !== 'undefined' && value !== null) {
      return value;
    }

    if (typeof chosenValue !== 'undefined' && chosenValue !== null) {
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

  _getSuggestions(query) {
    const {labelField, children, getSuggestions} = this.props;

    if (typeof getSuggestions === 'function') {
      return getSuggestions(query);
    }

    const escapedQuery = escapeRegexCharacters(query.trim());
    const regex = new RegExp('\\b' + escapedQuery, 'i');

    return _filter(children, (child) => regex.test(child.props[labelField]));
  },

  //
  // Events
  //
  _handleClick(event) {
    event.preventDefault();
    this.refs.textInput.getDOMNode().focus();
  },

  _handleArrowClick() {
    if (this.state.focus === true) {
      this.refs.textInput.getDOMNode().blur();
    } else {
      this.refs.textInput.getDOMNode().focus();
    }
  },

  _handleFocus(event) {
    event.preventDefault();

    this.setState({
      focus: true
    });

    setTimeout(() => {
      if (this.isMounted()) {
        this.refs.textInput.getDOMNode().select();
      }
    }, 10);
  },

  _selectOption(option) {
    // reset mousedown latch
    this._optionsMouseDown = false;
    this.refs.textInput.getDOMNode().blur();

    const {valueField, onSelect} = this.props;

    this.setState({
      chosenValue: option.props[valueField],
      focus: false,
      hoverValue: null,
      searchQuery: null,
      searchResults: null
    }, () => {
      let fakeEvent = {
        target: {
          value: option.props[valueField]
        },
        option
      };

      onSelect(fakeEvent);
    });
  },

  _handleBlur(event) {
    event.preventDefault();
    if (this._optionsMouseDown === true) {
      this._optionsMouseDown = false;
      this.refs.textInput.getDOMNode().focus();
      event.stopPropagation();
    } else {
      this.setState({
        focus: false
      });
    }
  },

  _handleOptionHover(child) {
    const {valueField} = this.props;

    this.setState({
      hoverValue: child.props[valueField]
    });
  },

  _handleOptionClick(child, event) {
    event.preventDefault();
    event.stopPropagation();

    this._selectOption(child);
  },

  _handleOptionsMouseDown() {
    // prevent windows issue where clicking on scrollbar triggers blur on input
    this._optionsMouseDown = true;
  },

  _handleInput(event) {
    var keys = {
      13: this._enter,
      37: this._moveLeft,
      38: this._moveUp,
      39: this._moveRight,
      40: this._moveDown,
      8: this._remove
    };

    if (typeof keys[event.keyCode] === 'function') {
      keys[event.keyCode](event);
    }
  },

  _move(options, operator) {
    if (operator !== 1 && operator !== -1) {
      throw new Error(`Movement operator is not 1 or -1. It's ${operator}`);
    }

    const {valueField} = this.props;
    const {hoverValue, selectedValue} = this.state;

    const highlightedValue = isDefined(hoverValue) && hoverValue !== null ? hoverValue : selectedValue;
    const highlightedIndex = _findIndex(options, (result) => result.props[valueField] === highlightedValue);

    if (typeof options[highlightedIndex + operator] !== 'undefined') {
      this.setState({
        hoverValue: options[highlightedIndex + operator].props[valueField]
      }, () => {
        // update scroll position
        this._updateScrollPosition();
      });
    }
  },

  _moveUp(event) {
    const {children} = this.props;
    const {searchResults} = this.state;

    const options = (searchResults || children);

    if (options && options.length > 0) {
      event.preventDefault();
      this._move(options, -1);
    }
  },

  _moveDown(event) {
    const {children} = this.props;
    const {searchResults} = this.state;

    const options = (searchResults || children);

    if (options && options.length > 0) {
      event.preventDefault();
      this._move(options, 1);
    }
  },

  _enter(event) {
    event.preventDefault();

    const {hoverValue} = this.state;

    if (hoverValue) {
      const option = this._getOption(hoverValue);
      this._selectOption(option);
    }
  },

  _handleChange(event) {
    event.preventDefault();

    const query = event.target.value;
    const searchResults = this._getSuggestions(query);

    this.setState({
      searchQuery: query,
      searchResults: searchResults
    });
  },

  _updateScrollPosition() {
    const highlighted = this.refs ? this.refs.highlighted : null;
    if (highlighted) {
      // find if highlighted option is not visible
      const el = highlighted.getDOMNode();
      let parent = this.refs.options.getDOMNode();
      const offsetTop = el.offsetTop + el.clientHeight - parent.scrollTop;

      // scroll down
      if (offsetTop > parent.clientHeight) {
        const diff = el.offsetTop + el.clientHeight - parent.clientHeight;
        parent.scrollTop = diff;
      } else if (offsetTop - el.clientHeight < 0) { // scroll up
        parent.scrollTop = el.offsetTop;
      }
    }
  },

  componentWillReceiveProps() {
    this.setState({
      chosenValue: null,
      hoverValue: null,
      searchQuery: null,
      searchResults: null
    });
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.focus === false && this.state.focus === true) {
      this._updateScrollPosition();
    }
  },

  render() {
    const {name, valueField, labelField, placeholder, children, icon} = this.props;
    const {hoverValue, searchQuery, searchResults} = this.state;

    const selectedValue = this._getSelectedValue();
    const selectedOption = (selectedValue !== null) ? this._getOption(selectedValue) : null;

    const options = _map((searchResults || children), (child, index) => {
      const highlightedValue = isDefined(hoverValue) && hoverValue !== null ? hoverValue : selectedValue;

      const highlighted = (child.props[valueField] === highlightedValue);

      const key = `${index}-${child.props[valueField]}`;

      return (
        <OptionWrapper key={key}
          selected={highlighted}
          ref={highlighted ? 'highlighted' : null}
          onHover={this._handleOptionHover}
          onClick={this._handleOptionClick}>
          {cloneWithProps(child, { query: searchQuery || '' })}
        </OptionWrapper>
      );
    });

    let inputValue;

    if (searchQuery !== null) {
      inputValue = searchQuery;
    } else if (selectedOption) {
      inputValue = selectedOption.props[labelField];
    }

    const isActive = this._isActive();

    const wrapperClasses = cx({
      'react-choice-wrapper': true,
      'react-choice-single': true,
      'react-choice-single--in-focus': isActive,
      'react-choice-single--not-in-focus': !isActive
    });

    var IconRenderer = icon || Icon;

    return (
      <div className="react-choice">
        <input type="hidden" name={name}
          value={selectedValue} ref="input" />

        <div className={wrapperClasses} onClick={this._handleClick}>
          <input type="text"
            className="react-choice-input react-choice-single__input"
            placeholder={placeholder}
            value={inputValue}

            onKeyDown={this._handleInput}
            onChange={this._handleChange}
            onFocus={this._handleFocus}
            onBlur={this._handleBlur}

            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isActive}
            ref="textInput" />
        </div>

        <div className="react-choice-icon" onMouseDown={this._handleArrowClick}>
          <IconRenderer focused={isActive} />
        </div>

        {isActive && options.length > 0 ?
          <Options onMouseDown={this._handleOptionsMouseDown} ref="options">
            {options}
          </Options> : null}
      </div>
    );
  }
});

export default SingleChoice;

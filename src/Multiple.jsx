import React from 'react/addons';
import _map from 'lodash.map';
import _filter from 'lodash.filter';
import _find from 'lodash.find';
import _findIndex from 'lodash.findindex';
import cx from 'classnames';

import Icon from './Icon';
import Options from './Options';
import OptionWrapper from './OptionWrapper';

import {escapeRegexCharacters, isDefined} from './utils';

const {cloneWithProps} = React.addons;

function noop() {}

const ValueWrapper = React.createClass({
  propTypes: {
    onDeleteClick: React.PropTypes.func.isRequired
  },

  onDeleteClick: function(event) {
    event.stopPropagation();
    this.props.onDeleteClick(event);
  },

  render: function() {
    const {children} = this.props;

    var classes = cx({
      'react-choice-value': true,
    });

    return (
      <div className={classes}>
        <div className="react-choice-value__children">{children}</div>
        <a className="react-choice-value__delete" onClick={this.onDeleteClick}>x</a>
      </div>
    );
  }
});


const MultipleChoice = React.createClass({
  propTypes: {
    values: React.PropTypes.arrayOf(
      React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
      ]),
    ), // initial values

    defaultValues: React.PropTypes.arrayOf(
      React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
      ]),
    ), // initial values

    children: React.PropTypes.array.isRequired, // options

    name: React.PropTypes.string, // name of input
    placeholder: React.PropTypes.string, // input placeholder
    disabled: React.PropTypes.bool,

    valueField: React.PropTypes.string, // value field name
    labelField: React.PropTypes.string, // label field name
    allowDuplicates: React.PropTypes.bool, // if true, the same values can be added multiple times

    icon: React.PropTypes.func, // icon render

    getSuggestions: React.PropTypes.func, // custom search function
    /*searchField: React.PropTypes.array, // array of search fields*/

    onSelect: React.PropTypes.func, // function called when option is selected
    onDelete: React.PropTypes.func, // function called when option is deleted
  },

  getDefaultProps() {
    return {
      values: [],
      defaultValues: [],
      valueField: 'value',
      labelField: 'children',
      allowDuplicates: false,
      onSelect: noop,
      onDelete: noop,
    };
  },

  getInitialState() {
    /*
    var props = this.props.searchField;
    props.push(this.props.valueField);
    props.push(this.props.searchField);
    props = _.uniq(props);

    var options = _map(this.props.children, function(child) {
      // TODO Validation ?
      return _.pick(child.props, props);
    }, this);
     */

    return {
      focus: false,
      chosenValues: [],
      hoverValue: null,
      searchQuery: null,
      searchResults: null,

      /*
      searchResults: this._sort(options),
      values: this.props.values,
      initialOptions: options,
      highlighted: null,
      selected: null,
      selectedIndex: -1,
      searchTokens: []
       */
    };
  },

  _getSelectedValues() {
    var {values, defaultValues} = this.props;
    var {chosenValues} = this.state;

    if (typeof values !== 'undefined' && values.length > 0) {
      return values;
    }

    if (typeof chosenValues !== 'undefined' && chosenValues.length > 0) {
      return chosenValues;
    }

    return defaultValues;
  },

  _getOption(value) {
    // TODO make this more efficient
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
    const {valueField, onSelect} = this.props;

    const selectedValues = this._getSelectedValues().slice(0);
    selectedValues.push(option.props[valueField]);

    this.setState({
      chosenValues: selectedValues,
      /*focus: {'$set': false},*/
      hoverValue: null,
      searchQuery: null,
      searchResults: null,
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
    this.setState({
      focus: false
    });
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

  _removeValue(value) {
    const {onDelete} = this.props;

    const selectedValues = this._getSelectedValues().slice(0);
    const index = _findIndex(selectedValues, (v) => v === value);

    if (index > -1) {
      // remove value
      selectedValues.splice(index, 1);
    }

    this.setState({
      chosenValues: selectedValues,
    });

    /*onDelete(removedOption, values);*/
  },

  // TODO

  /*
  _handleContainerInput: function(event) {
    var keys = {
      37: this._moveLeft,
      39: this._moveRight,
      8: this._removeSelectedContainer
    };

    if (typeof keys[event.keyCode] === 'function') {
      keys[event.keyCode](event);
    }
  },

  _handleContainerBlur: function() {
    if (this.state.selectedIndex) {
      this.setState({
        selectedIndex: -1
      });
    }
  },

  _moveLeft: function(event) {
    var input = this.refs.input.getDOMNode();

    if (!this.state.values.length) {
      return false;
    }

    if (
      event.target === input &&
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

  _moveRight: function() {
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
        input.focus();
        this.setState({
          selectedIndex: -1
        });
      }
    }
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
  */

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

    const selectedValues = this._getSelectedValues();
    const values = _map(selectedValues, (value, index) => {
      const option = this._getOption(value);

      const key = `${index}-${option.props[valueField]}`;

      return (
        <ValueWrapper key={key}
          onDeleteClick={this._removeValue.bind(null, value)}
          selected={false}>
          {option.props[labelField]}
        </ValueWrapper>
      );
    });

    const options = _map((searchResults || children), (child, index) => {
      const highlightedValue = isDefined(hoverValue) && hoverValue !== null ? hoverValue : null; //selectedValue;

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

    const isActive = this._isActive();

    const wrapperClasses = cx({
      'react-choice-wrapper': true,
      'react-choice-multiple': true,
      'react-choice-multiple--in-focus': isActive,
      'react-choice-multiple--not-in-focus': !isActive,
    });

    const IconRenderer = icon || Icon;

    return (
      <div className="react-choice">
        <input type="hidden" name={name}
          value={JSON.stringify(selectedValues)} ref="input" />

        <div className={wrapperClasses} onClick={this._handleClick}
          tabIndex="-1" ref="container" onKeyDown={this._handleContainerInput}
          onBlur={this._handleContainerBlur}>
          {values}
          <input type="text"
            placeholder={placeholder}
            value={searchQuery}
            className="react-choice-input react-choice-multiple__input"

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
          <Options ref="options">
            {options}
          </Options> : null}
      </div>
    );
  }
});

export default MultipleChoice;

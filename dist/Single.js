'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _Options = require('./Options');

var _Options2 = _interopRequireDefault(_Options);

var _OptionWrapper = require('./OptionWrapper');

var _OptionWrapper2 = _interopRequireDefault(_OptionWrapper);

var _utils = require('./utils');

var cloneWithProps = _reactAddons2['default'].addons.cloneWithProps;

function noop() {}

//
// Auto complete select box
//
var Single = _reactAddons2['default'].createClass({
  displayName: 'Single',

  propTypes: {
    value: _reactAddons2['default'].PropTypes.oneOfType([_reactAddons2['default'].PropTypes.string, _reactAddons2['default'].PropTypes.number]),
    defaultValue: _reactAddons2['default'].PropTypes.oneOfType([_reactAddons2['default'].PropTypes.string, _reactAddons2['default'].PropTypes.number]),

    children: _reactAddons2['default'].PropTypes.array.isRequired, // options

    name: _reactAddons2['default'].PropTypes.string, // name of input
    placeholder: _reactAddons2['default'].PropTypes.string, // input placeholder
    disabled: _reactAddons2['default'].PropTypes.bool,

    valueField: _reactAddons2['default'].PropTypes.string, // value field name
    labelField: _reactAddons2['default'].PropTypes.string, // label field name

    icon: _reactAddons2['default'].PropTypes.func, // icon render

    getSuggestions: _reactAddons2['default'].PropTypes.func, // custom search function
    onSelect: _reactAddons2['default'].PropTypes.func // function called when option is selected
  },

  //
  // Public methods
  //
  getValue: function getValue() {
    return this.state.selected ? this.state.selected[this.props.valueField] : null;
  },

  //
  // Internal methods
  //
  getDefaultProps: function getDefaultProps() {
    return {
      valueField: 'value',
      labelField: 'children',
      onSelect: noop
    };
  },

  getInitialState: function getInitialState() {
    return {
      focus: false,
      chosenValue: null,
      hoverValue: null,
      searchQuery: null,
      searchResults: null
    };
  },

  _getSelectedValue: function _getSelectedValue() {
    var _props = this.props;
    var value = _props.value;
    var defaultValue = _props.defaultValue;
    var chosenValue = this.state.chosenValue;

    if (typeof value !== 'undefined' && value !== null) {
      return value;
    }

    if (typeof chosenValue !== 'undefined' && chosenValue !== null) {
      return chosenValue;
    }

    return defaultValue;
  },

  _getOption: function _getOption(value) {
    var _props2 = this.props;
    var children = _props2.children;
    var valueField = _props2.valueField;

    return children.find(function (child) {
      return child.props[valueField] === value;
    });
  },

  _isActive: function _isActive() {
    return !this.props.disabled && this.state.focus;
  },

  _getSuggestions: function _getSuggestions(query) {
    var _props3 = this.props;
    var labelField = _props3.labelField;
    var children = _props3.children;
    var getSuggestions = _props3.getSuggestions;

    if (typeof getSuggestions === 'function') {
      return getSuggestions(query);
    }

    var escapedQuery = (0, _utils.escapeRegexCharacters)(query.trim());
    var regex = new RegExp('\\b' + escapedQuery, 'i');

    return children.filter(function (child) {
      return regex.test(child.props[labelField]);
    });
  },

  //
  // Events
  //
  _handleClick: function _handleClick(event) {
    event.preventDefault();
    this.refs.textInput.getDOMNode().focus();
  },

  _handleArrowClick: function _handleArrowClick() {
    if (this.state.focus === true) {
      this.refs.textInput.getDOMNode().blur();
    } else {
      this.refs.textInput.getDOMNode().focus();
    }
  },

  _handleFocus: function _handleFocus(event) {
    var _this = this;

    event.preventDefault();

    this.setState({
      focus: true
    });

    setTimeout(function () {
      if (_this.isMounted()) {
        _this.refs.textInput.getDOMNode().select();
      }
    }, 10);
  },

  _selectOption: function _selectOption(option) {
    // reset mousedown latch
    this._optionsMouseDown = false;
    this.refs.textInput.getDOMNode().blur();

    var _props4 = this.props;
    var valueField = _props4.valueField;
    var onSelect = _props4.onSelect;

    this.setState({
      chosenValue: option.props[valueField],
      focus: false,
      hoverValue: null,
      searchQuery: null,
      searchResults: null
    }, function () {
      var fakeEvent = {
        target: {
          value: option.props[valueField]
        },
        option: option
      };

      onSelect(fakeEvent);
    });
  },

  _handleBlur: function _handleBlur(event) {
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

  _handleOptionHover: function _handleOptionHover(child) {
    var valueField = this.props.valueField;

    this.setState({
      hoverValue: child.props[valueField]
    });
  },

  _handleOptionClick: function _handleOptionClick(child, event) {
    event.preventDefault();
    event.stopPropagation();

    this._selectOption(child);
  },

  _handleOptionsMouseDown: function _handleOptionsMouseDown() {
    // prevent windows issue where clicking on scrollbar triggers blur on input
    this._optionsMouseDown = true;
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

    if (typeof keys[event.keyCode] === 'function') {
      keys[event.keyCode](event);
    }
  },

  _move: function _move(options, operator) {
    var _this2 = this;

    if (operator !== 1 && operator !== -1) {
      throw new Error('Movement operator is not 1 or -1. It\'s ' + operator);
    }

    var valueField = this.props.valueField;
    var _state = this.state;
    var hoverValue = _state.hoverValue;
    var selectedValue = _state.selectedValue;

    var highlightedValue = (0, _utils.isDefined)(hoverValue) && hoverValue !== null ? hoverValue : selectedValue;
    var highlightedIndex = options.map(function (result) {
      return result.props[valueField];
    }).indexOf(highlightedValue);

    if (typeof options[highlightedIndex + operator] !== 'undefined') {
      this.setState({
        hoverValue: options[highlightedIndex + operator].props[valueField]
      }, function () {
        // update scroll position
        _this2._updateScrollPosition();
      });
    }
  },

  _moveUp: function _moveUp(event) {
    var children = this.props.children;
    var searchResults = this.state.searchResults;

    var options = searchResults || children;

    if (options && options.length > 0) {
      event.preventDefault();
      this._move(options, -1);
    }
  },

  _moveDown: function _moveDown(event) {
    var children = this.props.children;
    var searchResults = this.state.searchResults;

    var options = searchResults || children;

    if (options && options.length > 0) {
      event.preventDefault();
      this._move(options, 1);
    }
  },

  _enter: function _enter(event) {
    event.preventDefault();

    var hoverValue = this.state.hoverValue;

    if (hoverValue) {
      var option = this._getOption(hoverValue);
      this._selectOption(option);
    }
  },

  _handleChange: function _handleChange(event) {
    event.preventDefault();

    var query = event.target.value;
    var searchResults = this._getSuggestions(query);

    this.setState({
      searchQuery: query,
      searchResults: searchResults
    });
  },

  _updateScrollPosition: function _updateScrollPosition() {
    var highlighted = this.refs ? this.refs.highlighted : null;
    if (highlighted) {
      // find if highlighted option is not visible
      var el = highlighted.getDOMNode();
      var _parent = this.refs.options.getDOMNode();
      var offsetTop = el.offsetTop + el.clientHeight - _parent.scrollTop;

      // scroll down
      if (offsetTop > _parent.clientHeight) {
        var diff = el.offsetTop + el.clientHeight - _parent.clientHeight;
        _parent.scrollTop = diff;
      } else if (offsetTop - el.clientHeight < 0) {
        // scroll up
        _parent.scrollTop = el.offsetTop;
      }
    }
  },

  componentWillReceiveProps: function componentWillReceiveProps() {
    this.setState({
      chosenValue: null,
      hoverValue: null,
      searchQuery: null,
      searchResults: null
    });
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    if (prevState.focus === false && this.state.focus === true) {
      this._updateScrollPosition();
    }
  },

  render: function render() {
    var _this3 = this;

    var _props5 = this.props;
    var name = _props5.name;
    var valueField = _props5.valueField;
    var labelField = _props5.labelField;
    var placeholder = _props5.placeholder;
    var children = _props5.children;
    var icon = _props5.icon;
    var _state2 = this.state;
    var hoverValue = _state2.hoverValue;
    var searchQuery = _state2.searchQuery;
    var searchResults = _state2.searchResults;

    var selectedValue = this._getSelectedValue();
    var selectedOption = selectedValue !== null ? this._getOption(selectedValue) : null;

    var options = (searchResults || children).map(function (child, index) {
      var highlightedValue = (0, _utils.isDefined)(hoverValue) && hoverValue !== null ? hoverValue : selectedValue;

      var highlighted = child.props[valueField] === highlightedValue;

      var key = index + '-' + child.props[valueField];

      return _reactAddons2['default'].createElement(
        _OptionWrapper2['default'],
        { key: key,
          selected: highlighted,
          ref: highlighted ? 'highlighted' : null,
          onHover: _this3._handleOptionHover,
          onClick: _this3._handleOptionClick },
        cloneWithProps(child, { query: searchQuery || '' })
      );
    });

    var inputValue = undefined;

    if (searchQuery !== null) {
      inputValue = searchQuery;
    } else if (selectedOption) {
      inputValue = selectedOption.props[labelField];
    }

    var isActive = this._isActive();

    var wrapperClasses = (0, _classnames2['default'])({
      'react-choice-wrapper': true,
      'react-choice-single': true,
      'react-choice-single--in-focus': isActive,
      'react-choice-single--not-in-focus': !isActive
    });

    var IconRenderer = icon || _Icon2['default'];

    return _reactAddons2['default'].createElement(
      'div',
      { className: 'react-choice' },
      _reactAddons2['default'].createElement('input', { type: 'hidden', name: name,
        value: selectedValue, ref: 'input' }),
      _reactAddons2['default'].createElement(
        'div',
        { className: wrapperClasses, onClick: this._handleClick },
        _reactAddons2['default'].createElement('input', { type: 'text',
          className: 'react-choice-input react-choice-single__input',
          placeholder: placeholder,
          value: inputValue,

          onKeyDown: this._handleInput,
          onChange: this._handleChange,
          onFocus: this._handleFocus,
          onBlur: this._handleBlur,

          autoComplete: 'off',
          role: 'combobox',
          'aria-autocomplete': 'list',
          'aria-expanded': isActive,
          ref: 'textInput' })
      ),
      _reactAddons2['default'].createElement(
        'div',
        { className: 'react-choice-icon', onMouseDown: this._handleArrowClick },
        _reactAddons2['default'].createElement(IconRenderer, { focused: isActive })
      ),
      isActive && options.length > 0 ? _reactAddons2['default'].createElement(
        _Options2['default'],
        { onMouseDown: this._handleOptionsMouseDown, ref: 'options' },
        options
      ) : null
    );
  }
});

exports['default'] = Single;
module.exports = exports['default'];
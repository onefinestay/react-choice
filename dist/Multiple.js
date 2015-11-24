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

var ValueWrapper = _reactAddons2['default'].createClass({
  displayName: 'ValueWrapper',

  propTypes: {
    onDeleteClick: _reactAddons2['default'].PropTypes.func.isRequired
  },

  onDeleteClick: function onDeleteClick(event) {
    event.stopPropagation();
    this.props.onDeleteClick(event);
  },

  render: function render() {
    var children = this.props.children;

    var classes = (0, _classnames2['default'])({
      'react-choice-value': true
    });

    return _reactAddons2['default'].createElement(
      'div',
      { className: classes },
      _reactAddons2['default'].createElement(
        'div',
        { className: 'react-choice-value__children' },
        children
      ),
      _reactAddons2['default'].createElement(
        'a',
        { className: 'react-choice-value__delete', onClick: this.onDeleteClick },
        'x'
      )
    );
  }
});

var MultipleChoice = _reactAddons2['default'].createClass({
  displayName: 'MultipleChoice',

  propTypes: {
    values: _reactAddons2['default'].PropTypes.arrayOf(_reactAddons2['default'].PropTypes.oneOfType([_reactAddons2['default'].PropTypes.string, _reactAddons2['default'].PropTypes.number])), // initial values

    defaultValues: _reactAddons2['default'].PropTypes.arrayOf(_reactAddons2['default'].PropTypes.oneOfType([_reactAddons2['default'].PropTypes.string, _reactAddons2['default'].PropTypes.number])), // initial values

    children: _reactAddons2['default'].PropTypes.array.isRequired, // options

    name: _reactAddons2['default'].PropTypes.string, // name of input
    placeholder: _reactAddons2['default'].PropTypes.string, // input placeholder
    disabled: _reactAddons2['default'].PropTypes.bool,

    valueField: _reactAddons2['default'].PropTypes.string, // value field name
    labelField: _reactAddons2['default'].PropTypes.string, // label field name
    allowDuplicates: _reactAddons2['default'].PropTypes.bool, // if true, the same values can be added multiple times

    icon: _reactAddons2['default'].PropTypes.func, // icon render

    getSuggestions: _reactAddons2['default'].PropTypes.func, // custom search function
    /*searchField: React.PropTypes.array, // array of search fields*/

    onSelect: _reactAddons2['default'].PropTypes.func, // function called when option is selected
    onDelete: _reactAddons2['default'].PropTypes.func },

  // function called when option is deleted
  getDefaultProps: function getDefaultProps() {
    return {
      values: [],
      defaultValues: [],
      valueField: 'value',
      labelField: 'children',
      allowDuplicates: false,
      onSelect: noop,
      onDelete: noop
    };
  },

  getInitialState: function getInitialState() {
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
      searchResults: null

    };
  },

  /*
  searchResults: this._sort(options),
  values: this.props.values,
  initialOptions: options,
  highlighted: null,
  selected: null,
  selectedIndex: -1,
  searchTokens: []
   */
  _getSelectedValues: function _getSelectedValues() {
    var _props = this.props;
    var values = _props.values;
    var defaultValues = _props.defaultValues;
    var chosenValues = this.state.chosenValues;

    if (typeof values !== 'undefined' && values.length > 0) {
      return values;
    }

    if (typeof chosenValues !== 'undefined' && chosenValues.length > 0) {
      return chosenValues;
    }

    return defaultValues;
  },

  _getOption: function _getOption(value) {
    // TODO make this more efficient
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
    var _props4 = this.props;
    var valueField = _props4.valueField;
    var onSelect = _props4.onSelect;

    var selectedValues = this._getSelectedValues().slice(0);
    selectedValues.push(option.props[valueField]);

    this.setState({
      chosenValues: selectedValues,
      /*focus: {'$set': false},*/
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
    this.setState({
      focus: false
    });
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

  _removeValue: function _removeValue(value) {
    var onDelete = this.props.onDelete;

    var selectedValues = this._getSelectedValues().slice(0);
    var index = selectedValues.indexOf(value);

    if (index > -1) {
      // remove value
      selectedValues.splice(index, 1);
    }

    this.setState({
      chosenValues: selectedValues
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

    var selectedValues = this._getSelectedValues();
    var values = selectedValues.map(function (value, index) {
      var option = _this3._getOption(value);

      var key = index + '-' + option.props[valueField];

      return _reactAddons2['default'].createElement(
        ValueWrapper,
        { key: key,
          onDeleteClick: _this3._removeValue.bind(null, value),
          selected: false },
        option.props[labelField]
      );
    });

    var options = (searchResults || children).map(function (child, index) {
      var highlightedValue = (0, _utils.isDefined)(hoverValue) && hoverValue !== null ? hoverValue : null; //selectedValue;

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

    var isActive = this._isActive();

    var wrapperClasses = (0, _classnames2['default'])({
      'react-choice-wrapper': true,
      'react-choice-multiple': true,
      'react-choice-multiple--in-focus': isActive,
      'react-choice-multiple--not-in-focus': !isActive
    });

    var IconRenderer = icon || _Icon2['default'];

    return _reactAddons2['default'].createElement(
      'div',
      { className: 'react-choice' },
      _reactAddons2['default'].createElement('input', { type: 'hidden', name: name,
        value: JSON.stringify(selectedValues), ref: 'input' }),
      _reactAddons2['default'].createElement(
        'div',
        { className: wrapperClasses, onClick: this._handleClick,
          tabIndex: '-1', ref: 'container', onKeyDown: this._handleContainerInput,
          onBlur: this._handleContainerBlur },
        values,
        _reactAddons2['default'].createElement('input', { type: 'text',
          placeholder: placeholder,
          value: searchQuery,
          className: 'react-choice-input react-choice-multiple__input',

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
        { ref: 'options' },
        options
      ) : null
    );
  }
});

exports['default'] = MultipleChoice;
module.exports = exports['default'];
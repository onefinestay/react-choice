"use strict";

var React = require('react/addons');
var _ = require('lodash');

var humanizeString = require('./humanize-string');

var TextHighlight = React.createClass({displayName: 'TextHighlight',
  propTypes: {
    text: React.PropTypes.string.isRequired, // text to display
    tokens: React.PropTypes.array.isRequired // array of search tokens
  },

  shouldComponentUpdate: function(nextProps) {
    if (!_.isEqual(nextProps, this.props)) {
      return true;
    }
    return false;
  },

  splitText: function(splits, regex) {
    var _splits = [];
    _.each(splits, function(split) {
      if (split.match === false) {
        var match = split.text.match(regex);
        if (match) {
          var s = split.text.split(regex);

          _.each(s, function(_s, index) {
            _splits.push({
              text: _s,
              match: false
            });

            if (index !== s.length - 1) {
              var matchCharacter = match[0];

              var i = _splits.length - 1;
              if ((_.isEmpty(_s) && i === 0) || _s.slice(-1) === ' ') {
                matchCharacter = humanizeString(matchCharacter);
              } else {
                matchCharacter = matchCharacter.toLowerCase();
              }

              _splits.push({
                text: matchCharacter,
                match: true
              });
            }
          });
        } else {
          _splits.push(split);
        }
      } else {
        _splits.push(split);
      }
    });
    return _splits;
  },

  render: function() {
    var label = this.props.text;
    var tokens = this.props.tokens;

    var splits = [{
      text: label,
      match: false
    }];

    _.each(tokens, function(token) {
      splits = this.splitText(splits, token.regex);
    }, this);

    var output = _.map(splits, function(split, i) {
      var key = [split.text, split.match, i].join('.');
      if (split.match) {
        return React.createElement("span", {className: "text-highlight__match", key: key}, split.text);
      } else {
        return React.createElement("span", {key: key}, split.text);
      }
    });

    return (
      React.createElement("span", {className: "text-highlight"}, 
        output
      )
    );
  }
});

module.exports = TextHighlight;

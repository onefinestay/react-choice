'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.escapeRegexCharacters = escapeRegexCharacters;
exports.isDefined = isDefined;

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isDefined(value) {
  return typeof value !== 'undefined';
}
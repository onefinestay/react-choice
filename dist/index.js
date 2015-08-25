'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var _Single = require('./Single');

_defaults(exports, _interopExportWildcard(_Single, _defaults));

var _Multiple = require('./Multiple');

_defaults(exports, _interopExportWildcard(_Multiple, _defaults));

var _Option = require('./Option');

_defaults(exports, _interopExportWildcard(_Option, _defaults));
'use strict';

module.exports = function (string, upperCase) {
  if (typeof string == 'string') {
    var firstCharacter = string.charAt(0);

    if (typeof upperCase === 'undefined' || upperCase === true) {
      firstCharacter = firstCharacter.toUpperCase();
    }

    var display = firstCharacter + string.slice(1);
    return display.replace(/_|-/g, ' ');
  } else {
    return string;
  }
};
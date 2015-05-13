// This file is required in mocha.opts
// This gives scripts access to initDOM and cleanDOM functions
// so that they can run tests that rely on the DOM

global.initDOM = function() {
  var jsdom = require('node-jsdom');

  global.document = jsdom.jsdom();
  global.window = global.document.parentWindow;
  global.navigator = global.window.navigator;

  for (var i in require.cache) {
    delete require.cache[i];
  }
};

global.cleanDOM = function() {
  delete global.window;
  delete global.document;
  delete global.navigator;
};

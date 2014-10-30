var Choice = require('react-choice');

var countries = [
  {"name": "Afghanistan", "code": "AF"},
  {"name": "Åland Islands", "code": "AX"},
  {"name": "Albania", "code": "AL"},
  // etc...
];

// Render component
<Choice.Single
  options={countries}
  placeholder="Select a country" />

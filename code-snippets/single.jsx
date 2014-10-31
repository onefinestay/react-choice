var Choice = require('react-choice');

var countries = [
  {"name": "Afghanistan", "code": "AF"},
  {"name": "Albania", "code": "AL"},
  {"name": "Algeria", "code": "DZ"},
  // etc...
];

// Render component
<Choice.Single
  options={countries}
  placeholder="Select a country" />

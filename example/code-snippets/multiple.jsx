var Choice = require('react-choice');

var countries = [
  {"label": "Afghanistan", "value": "AF"},
  {"label": "Albania", "value": "AL"},
  {"label": "Algeria", "value": "DZ"},
  // etc...
];

var options = countries.map(function(country) {
  <Choice.Option
    key={country.value}
    value={country.value}
    label={country.label} />;
});

// Render component
<Choice.Multiple placeholder="Select a country">
  {options}
</Choice.Multiple>

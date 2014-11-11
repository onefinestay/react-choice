var Choice = require('react-choice');

var countries = [
  {"label": "Afghanistan", "value": "AF"},
  {"label": "Albania", "value": "AL"},
  {"label": "Algeria", "value": "DZ"},
  // etc...
];

var options = countries.map(function(country) {
  return <Choice.Option
    key={country.value}
    value={country.value}
    label={country.label} />;
});

// Render component
<Choice.Single placeholder="Select a country">
  {options}
</Choice.Single>

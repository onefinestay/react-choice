var Choice = require('react-choice');

var countries = [
  {"label": "Afghanistan", "value": "AF"},
  {"label": "Albania", "value": "AL"},
  {"label": "Algeria", "value": "DZ"},
  // etc...
];

var options = countries.map(function(country) {
  return (
    <Choice.Option value={country.value}>
      {country.label}
    </Choice.Option>
  );
});

// Render component
<Choice.Multiple placeholder="Select a country">
  {options}
</Choice.Multiple>

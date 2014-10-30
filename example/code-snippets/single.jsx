var Choice = require('react-choice');

// Create options
var options = [
  <Choice.SearchResult value="foo" label="Foo"/>,
  <Choice.SearchResult value="bar" label="Bar"/>
];

// Render component
<Choice.Single placeholder="Select a country">
  {options}
</Choice.Single>

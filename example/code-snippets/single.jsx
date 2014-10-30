var Choice = require('react-choice');

// Create options
var options = [
  <Choice.SearchResult value="foo" label="Foo"/>,
  <Choice.SearchResult value="bar" label="Bar"/>
];

// Render component
<Choice.Single>
  {options}
</Choice.Single>

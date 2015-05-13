import {Select, Option} from 'react-choice';

const countries = [
  {"label": "Afghanistan", "value": "AF"},
  {"label": "Albania", "value": "AL"},
  {"label": "Algeria", "value": "DZ"},
  // etc...
];

// Render component
<Select placeholder="Select a country">
  {countries.map((country) => {
    return (
      <Option value={country.value}>
        {country.label}
      </Option>
    );
  })}
</Select>

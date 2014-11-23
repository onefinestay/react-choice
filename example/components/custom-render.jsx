"use strict";

var fs = require('fs');
var React = require('react/addons');
var CodeSnippet = require('./code-snippet');
var Choice = require('../../');
var _ = require('lodash');

var POKEMON = require('../data/pokemon.json');

var PokemonRenderer = React.createClass({
  mixins: [Choice.OptionMixin],

  render: function() {
    var pokemon = this.props.pokemon;

    var weight = pokemon.weight / 10;
    var height = pokemon.height / 10;

    return (
      <div className="pokemon">
        <div className="pokemon__image">
          <img src={pokemon.image} />
        </div>
        <div className="pokemon__name">
          <span className="pokemon__number">
            #{pokemon.national_id}
          </span>
          <Choice.TextHighlight tokens={this.props.tokens}>
            {pokemon.name}
          </Choice.TextHighlight>
          <div className="pokemon__attributes">
            HP: {pokemon.hp} | Height: {height} m | Weight: {weight} kg
          </div>
        </div>
      </div>
    );
  }
});

var customExample = fs.readFileSync(__dirname + '/../code-snippets/custom-render.jsx', 'utf8');

var CustomRender = React.createClass({
  render: function() {
    var options = _.map(POKEMON, function(pokemon) {
      var value = pokemon.national_id;
      return (
        <PokemonRenderer key={value} value={value} pokemon={pokemon}>
          {pokemon.name}
        </PokemonRenderer>
      );
    });

    var sorter = function(list) {
      return _.sortBy(list, 'national_id');
    };

    return (
      <section className="tutorial">
        <h3>Custom Renderer</h3>
        <div className="tutorial__example">
          <Choice.Select placeholder="Select a pokemon" sorter={sorter}>
            {options}
          </Choice.Select>
        </div>
        <div className="tutorial__guide">
          <p>Creating a custom renderer for the options is easy:</p>
          <CodeSnippet language="javascript" toggle={false}>
            {customExample}
          </CodeSnippet>
          <p><code>TextHighlight</code> is a component that contains the logic
            to highlight the text from the search tokens that Sifter returns.</p>
          <p className="info">Pokemon data provided by <a href="http://pokeapi.co/">Pokéapi</a></p>
        </div>
      </section>
    );
  }
});

module.exports = CustomRender;

"use strict";

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
        <h2>Custom Renderer</h2>
        <div className="tutorial__example">
          <Choice.Select placeholder="Select a pokemon" sorter={sorter}>
            {options}
          </Choice.Select>
        </div>
        <div className="tutorial__guide">
        </div>
        <div style={{clear: 'both'}}></div>
      </section>
    );
  }
});

module.exports = CustomRender;

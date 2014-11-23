var Choice = require('react-choice');

var PokemonRenderer = React.createClass({
  // The option mixin provides proptypes that the component requires
  mixins: [Choice.OptionMixin],

  render: function() {
    var pokemon = this.props.pokemon;

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
            HP: {pokemon.hp} | Height: {pokemon.height} m | Weight: {pokemon.weight} kg
          </div>
        </div>
      </div>
    );
  }
});

var options = POKEMON.map(function(pokemon) {
  return (
    <PokemonRenderer value={pokemon.national_id} pokemon={pokemon}>
      {pokemon.name}
    </PokemonRenderer>
  );
});

// Render component
<Choice.Select placeholder="Select a pokemon">
  {options}
</Choice.Select>

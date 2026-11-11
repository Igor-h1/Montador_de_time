// data/sonsTipos.js
// Um som para cada um dos 17 tipos, tocado ao clicar em um Pokémon ou em "Adicionar ao time".
// Só o PRIMEIRO tipo do Pokémon conta. Para trocar um som, substitua o arquivo em
// assets/sons/tipos/ mantendo o nome (o require precisa de caminhos fixos, por isso este mapa).

export const SONS_TIPOS = {
  normal: require('../assets/sons/tipos/normal.wav'),
  fire: require('../assets/sons/tipos/fire.wav'),
  water: require('../assets/sons/tipos/water.wav'),
  electric: require('../assets/sons/tipos/electric.wav'),
  grass: require('../assets/sons/tipos/grass.wav'),
  ice: require('../assets/sons/tipos/ice.wav'),
  fighting: require('../assets/sons/tipos/fighting.wav'),
  poison: require('../assets/sons/tipos/poison.wav'),
  ground: require('../assets/sons/tipos/ground.wav'),
  flying: require('../assets/sons/tipos/flying.wav'),
  psychic: require('../assets/sons/tipos/psychic.wav'),
  bug: require('../assets/sons/tipos/bug.wav'),
  rock: require('../assets/sons/tipos/rock.wav'),
  ghost: require('../assets/sons/tipos/ghost.wav'),
  dragon: require('../assets/sons/tipos/dragon.wav'),
  dark: require('../assets/sons/tipos/dark.wav'),
  steel: require('../assets/sons/tipos/steel.wav'),
};

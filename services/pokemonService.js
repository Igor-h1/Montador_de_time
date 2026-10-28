// services/pokemonService.js
// Único ponto de acesso aos dados dos Pokémon. As telas não importam
// data/pokemons.js direto: usam estas funções.

import { POKEMONS } from '../data/pokemons';
import { SPRITES } from '../data/spritesMap';

// Índice por id, para buscar sem varrer a lista inteira
const POR_ID = new Map(POKEMONS.map((p) => [p.id, p]));

// Cache da lista por jogo (evita recriar 386 objetos a cada render)
const CACHE_POR_JOGO = {};

// Retorna o Pokémon ou null se o id não existir
export function buscarPorId(id) {
  return POR_ID.get(Number(id)) || null;
}

export function estaDisponivel(id, jogoId) {
  const pokemon = POR_ID.get(Number(id));
  return Boolean(pokemon && pokemon.disponibilidade[jogoId]);
}

// Todos os Pokémon, ordenados por id, cada um com o campo "disponivel"
// para o jogo informado. Os indisponíveis aparecem bloqueados na Pokédex.
export function listarPorJogo(jogoId) {
  if (!CACHE_POR_JOGO[jogoId]) {
    CACHE_POR_JOGO[jogoId] = POKEMONS.map((p) => ({
      ...p,
      disponivel: Boolean(p.disponibilidade[jogoId]),
    })).sort((a, b) => a.id - b.id);
  }
  return CACHE_POR_JOGO[jogoId];
}

// Só os que existem no jogo (usado, por exemplo, para contagens)
export function listarDisponiveis(jogoId) {
  return listarPorJogo(jogoId).filter((p) => p.disponivel);
}

// Sprite local do Pokémon naquele jogo, ou null se não existir.
// Quem exibir a imagem deve tratar o null (ex.: mostrar um "?").
export function obterSprite(id, jogoId) {
  const doJogo = SPRITES[jogoId];
  return (doJogo && doJogo[Number(id)]) || null;
}

// Link do botão "Saiba mais" (única parte do app que precisa de internet)
export function urlSaibaMais(pokemon) {
  return `https://pokemondb.net/pokedex/${pokemon.slug}`;
}

// services/pokemonService.js
// Único ponto de acesso aos dados dos Pokémon. As telas não importam
// data/pokemons.js direto: usam estas funções.
//
// data/pokemons.js é o índice dos 649 Pokémon (id, nome, tipos).
// Cada jogo só "enxerga" os Pokémon até o seu maxId (386, 493 ou 649).
// - Jogos OFFLINE: disponibilidade e sprites estão dentro do app.
// - Jogos ONLINE: a disponibilidade vem da PokéAPI (services/pokedexOnline.js)
//   e os sprites são carregados por URL.

import { POKEMONS } from '../data/pokemons';
import { JOGOS } from '../data/jogos';
import { SPRITES } from '../data/spritesMap';
import { obterDexOnline } from './pokedexOnline';

const BASE_SPRITES_ONLINE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions';

// Índice por id, para buscar sem varrer a lista inteira
const POR_ID = new Map(POKEMONS.map((p) => [p.id, p]));

// Cache da lista por jogo (evita recriar centenas de objetos a cada render)
const CACHE_POR_JOGO = {};
const LISTA_VAZIA = [];

// Objetos { uri } dos sprites online. Reaproveitar o mesmo objeto mantém o
// React.memo do Card funcionando (um objeto novo a cada render quebraria isso).
const CACHE_SPRITES_ONLINE = {};

function disponivelNoJogo(pokemon, jogo) {
  if (jogo.offline) return Boolean(pokemon.disponibilidade[jogo.id]);
  const dex = obterDexOnline(jogo.id);
  return Boolean(dex && dex.has(pokemon.id));
}

// Retorna o Pokémon ou null se o id não existir
export function buscarPorId(id) {
  return POR_ID.get(Number(id)) || null;
}

export function estaDisponivel(id, jogoId) {
  const pokemon = POR_ID.get(Number(id));
  const jogo = JOGOS[jogoId];
  return Boolean(pokemon && jogo && disponivelNoJogo(pokemon, jogo));
}

// Os Pokémon que o jogo conhece (até o maxId), ordenados por id, cada um com
// o campo "disponivel". Os indisponíveis aparecem bloqueados na Pokédex.
// Em jogo online, devolve lista vazia até a Pokédex dele ser carregada.
export function listarPorJogo(jogoId) {
  const jogo = JOGOS[jogoId];
  if (!jogo) return LISTA_VAZIA;
  if (!jogo.offline && !obterDexOnline(jogoId)) return LISTA_VAZIA;

  if (!CACHE_POR_JOGO[jogoId]) {
    CACHE_POR_JOGO[jogoId] = POKEMONS.filter((p) => p.id <= jogo.maxId)
      .map((p) => ({ ...p, disponivel: disponivelNoJogo(p, jogo) }))
      .sort((a, b) => a.id - b.id);
  }
  return CACHE_POR_JOGO[jogoId];
}

// Só os que existem no jogo (usado, por exemplo, para contagens)
export function listarDisponiveis(jogoId) {
  return listarPorJogo(jogoId).filter((p) => p.disponivel);
}

// Sprite do Pokémon naquele jogo:
//  - jogo offline: imagem local (require) ou null se não existir
//  - jogo online: { uri } apontando para o repositório de sprites da PokéAPI
// Quem exibir a imagem deve tratar o null e o onError (ex.: mostrar um "?").
export function obterSprite(id, jogoId) {
  const jogo = JOGOS[jogoId];
  if (!jogo) return null;

  if (jogo.offline) {
    const doJogo = SPRITES[jogoId];
    return (doJogo && doJogo[Number(id)]) || null;
  }

  const chave = `${jogo.spritePasta}_${id}`;
  if (!CACHE_SPRITES_ONLINE[chave]) {
    CACHE_SPRITES_ONLINE[chave] = {
      uri: `${BASE_SPRITES_ONLINE}/${jogo.spriteGeracao}/${jogo.spritePasta}/${id}.png`,
    };
  }
  return CACHE_SPRITES_ONLINE[chave];
}

// Link do botão "Saiba mais" (precisa de internet em qualquer jogo)
export function urlSaibaMais(pokemon) {
  return `https://pokemondb.net/pokedex/${pokemon.slug}`;
}

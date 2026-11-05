// services/shiny.js
// Sprite SHINY de um Pokémon no estilo de um jogo (só existe na internet: nenhum shiny
// vem embutido no app). Segue a mesma regra dos sprites normais: o LeafGreen usa a pasta
// do FireRed e o Ruby/Sapphire usam a do Emerald; Black 2/White 2 usam a de Black/White.
// Devolve uma LISTA de fontes (formato do SpriteRemoto).

import { JOGOS } from '../data/jogos';

const BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions';

// Reaproveitar a mesma lista de { uri } evita recarregar a imagem a cada render
const CACHE = {};

export function fontesShiny(id, jogoId) {
  const jogo = JOGOS[jogoId];
  if (!jogo) return [];

  // Jogo offline que reaproveita outro (baseOffline) usa a pasta desse outro
  const origem = jogo.offline && jogo.baseOffline ? JOGOS[jogo.baseOffline] : jogo;
  const chave = `${origem.spritePasta}_${id}`;

  if (!CACHE[chave]) {
    CACHE[chave] = [
      { uri: `${BASE}/${origem.spriteGeracao}/${origem.spritePasta}/shiny/${Number(id)}.png` },
    ];
  }
  return CACHE[chave];
}

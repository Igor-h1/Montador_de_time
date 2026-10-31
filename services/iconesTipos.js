// services/iconesTipos.js
// Ícone original de um tipo (o rótulo "FIRE", "WATER"... do jogo).
//  - jogo offline: imagem embutida no app (assets/tipos/), ou null se não existir
//  - jogo online: { uri } apontando para o repositório de sprites da PokéAPI
// Quem exibir o ícone deve tratar o null e o onError usando o emoji (data/tipos.js).

import { JOGOS } from '../data/jogos';
import { IDS_TIPOS, ICONES_TIPOS } from '../data/iconesTiposMap';

const BASE_ICONES_ONLINE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types';

// Reaproveitar o mesmo objeto { uri } evita recarregar a imagem a cada render
const CACHE_ONLINE = {};

export function obterIconeTipo(tipo, jogoId) {
  const jogo = JOGOS[jogoId];
  if (!jogo) return null;

  if (jogo.offline) {
    // LeafGreen usa os ícones do FireRed; Ruby e Sapphire, os do Emerald
    const doJogo = ICONES_TIPOS[jogo.baseOffline || jogo.id];
    return (doJogo && doJogo[tipo]) || null;
  }

  const numero = IDS_TIPOS[tipo];
  if (!numero) return null;

  // Na maioria dos jogos a pasta dos ícones é a mesma dos sprites; Black 2/White 2 têm a própria
  const pasta = jogo.iconeTipoPasta || jogo.spritePasta;
  const chave = `${pasta}_${tipo}`;
  if (!CACHE_ONLINE[chave]) {
    CACHE_ONLINE[chave] = {
      uri: `${BASE_ICONES_ONLINE}/${jogo.spriteGeracao}/${pasta}/${numero}.png`,
    };
  }
  return CACHE_ONLINE[chave];
}

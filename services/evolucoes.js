// services/evolucoes.js
// Evolução de um Pokémon (de quem ele evolui e para quem), a partir de data/evolucoes.js.
// Cada jogo só conhece os Pokémon até o seu maxId, então uma pré-evolução ou evolução
// que só existe em geração mais nova não aparece (ex.: no FireRed o Roselia não "evolui
// de" Budew, que é da 4ª geração).

import { EVOLUCOES } from '../data/evolucoes';
import { buscarPorId } from './pokemonService';

// false enquanto o arquivo estiver vazio (antes de rodar scripts/gerarEvolucoes.js).
// Sem dados, as telas não mostram o cartão, em vez de dizer que ninguém evolui.
export function temDadosEvolucao() {
  return Object.keys(EVOLUCOES).length > 0;
}

// Devolve { de, para }:
//   de   = { pokemon, metodo } ou null (não tem pré-evolução)
//   para = [{ pokemon, metodo }, ...] (vazio se não evolui)
// "maxId" é o maior número de Pokémon que o jogo conhece (649 na Pokédex geral).
export function obterEvolucao(id, maxId = 649) {
  const registro = EVOLUCOES[Number(id)];
  if (!registro) return { de: null, para: [] };

  const deBase = registro.de && registro.de.id <= maxId ? registro.de : null;
  const de = deBase ? { pokemon: buscarPorId(deBase.id), metodo: deBase.metodo } : null;

  const para = registro.para
    .filter((evolucao) => evolucao.id <= maxId)
    .map((evolucao) => ({ pokemon: buscarPorId(evolucao.id), metodo: evolucao.metodo }));

  return {
    de: de && de.pokemon ? de : null,
    para: para.filter((evolucao) => evolucao.pokemon),
  };
}

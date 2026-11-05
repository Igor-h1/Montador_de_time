// services/filtros.js
// Regras do filtro de tipos das Pokédex (escolher vários tipos).
//  - MODO_QUALQUER: mostra o Pokémon que tem PELO MENOS UM dos tipos escolhidos
//  - MODO_TODOS:    mostra só o Pokémon que tem TODOS os tipos escolhidos
//                   (como um Pokémon tem no máximo 2 tipos, escolher 3 ou mais não acha nenhum)

export const MODO_QUALQUER = 'qualquer';
export const MODO_TODOS = 'todos';

// "tipos" é a lista de tipos escolhidos; lista vazia = sem filtro
export function passaFiltroTipos(pokemon, tipos, modo) {
  if (tipos.length === 0) return true;
  return modo === MODO_TODOS
    ? tipos.every((tipo) => pokemon.tipos.includes(tipo))
    : tipos.some((tipo) => pokemon.tipos.includes(tipo));
}

// Liga ou desliga um tipo, devolvendo uma lista NOVA (a original não é alterada)
export function alternarTipo(tipos, tipo) {
  return tipos.includes(tipo) ? tipos.filter((t) => t !== tipo) : [...tipos, tipo];
}

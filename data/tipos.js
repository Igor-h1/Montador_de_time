// data/tipos.js
// Tipos e tabela de efetividade da GERAÇÃO 3 (FireRed / Emerald).
// Diferença importante da tabela moderna: nesta geração, Steel
// resiste a Ghost e a Dark. Não existe o tipo Fairy.

export const TIPOS = {
  normal:   { nome: 'Normal',   cor: '#A8A878', icone: '⚪' },
  fire:     { nome: 'Fire',     cor: '#F08030', icone: '🔥' },
  water:    { nome: 'Water',    cor: '#6890F0', icone: '💧' },
  electric: { nome: 'Electric', cor: '#F8D030', icone: '⚡' },
  grass:    { nome: 'Grass',    cor: '#78C850', icone: '🌿' },
  ice:      { nome: 'Ice',      cor: '#98D8D8', icone: '❄️' },
  fighting: { nome: 'Fighting', cor: '#C03028', icone: '🥊' },
  poison:   { nome: 'Poison',   cor: '#A040A0', icone: '☠️' },
  ground:   { nome: 'Ground',   cor: '#E0C068', icone: '⛰️' },
  flying:   { nome: 'Flying',   cor: '#A890F0', icone: '🕊️' },
  psychic:  { nome: 'Psychic',  cor: '#F85888', icone: '🔮' },
  bug:      { nome: 'Bug',      cor: '#A8B820', icone: '🐛' },
  rock:     { nome: 'Rock',     cor: '#B8A038', icone: '🗿' },
  ghost:    { nome: 'Ghost',    cor: '#705898', icone: '👻' },
  dragon:   { nome: 'Dragon',   cor: '#7038F8', icone: '🐉' },
  dark:     { nome: 'Dark',     cor: '#705848', icone: '🌑' },
  steel:    { nome: 'Steel',    cor: '#B8B8D0', icone: '⚙️' },
};

export const LISTA_TIPOS = Object.keys(TIPOS);

// EFETIVIDADE[atacante][defensor] = multiplicador de dano.
// O que não aparece na tabela vale 1 (dano normal).
const EFETIVIDADE = {
  normal:   { rock: 0.5, steel: 0.5, ghost: 0 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
  ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5 },
  rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5, steel: 0.5 },
  dragon:   { dragon: 2, steel: 0.5 },
  dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, steel: 0.5 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5 },
};

// Multiplicador de um tipo atacante contra um Pokémon (1 ou 2 tipos).
// Para tipo duplo, os multiplicadores se multiplicam (ex.: 2 x 2 = 4).
export function multiplicador(atacante, tiposDefensor) {
  const linha = EFETIVIDADE[atacante] || {};
  return tiposDefensor.reduce((total, defensor) => total * (linha[defensor] ?? 1), 1);
}

// Agrupa todos os tipos atacantes pelo dano que causam ao Pokémon.
// Exemplo: calcularFraquezas(['fire', 'flying'])
//   -> { x4: ['rock'], x2: ['water', 'electric'], x05: [...], x025: [...], imune: ['ground'] }
export function calcularFraquezas(tiposDefensor) {
  const resultado = { x4: [], x2: [], x05: [], x025: [], imune: [] };

  LISTA_TIPOS.forEach((atacante) => {
    const m = multiplicador(atacante, tiposDefensor);
    if (m === 0) resultado.imune.push(atacante);
    else if (m === 4) resultado.x4.push(atacante);
    else if (m === 2) resultado.x2.push(atacante);
    else if (m === 0.5) resultado.x05.push(atacante);
    else if (m === 0.25) resultado.x025.push(atacante);
  });

  return resultado;
}

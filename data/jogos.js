// data/jogos.js
// Jogos suportados pelo app. Para adicionar outro jogo no futuro,
// basta incluir um novo objeto aqui.
//
// Campos:
//   geracao          geração do jogo
//   maxId            maior número de Pokémon que o jogo conhece (386, 493 ou 649)
//   offline          true  = dados e sprites embutidos no app (funciona sem internet)
//                    false = a lista e os sprites vêm da API (precisa de internet)
//   ativo            false = esconde o jogo da Home
//   baseOffline      (só jogos offline) id de outro jogo offline cujos sprites e lista
//                    de disponíveis são reaproveitados. Sem esse campo, o jogo usa os próprios.
//   pokedexRegional  Pokédex da PokéAPI que define quem está "disponível"
//   spriteGeracao / spritePasta   pasta dos sprites na PokéAPI (e em assets/sprites/)

export const JOGOS = {
  // ----- OFFLINE (geração 3) -----
  firered: {
    id: 'firered',
    nome: 'FireRed',
    cor: '#E8452C',
    geracao: 3,
    maxId: 386,
    offline: true,
    ativo: true,
    pokedexRegional: 'kanto',
    spriteGeracao: 'generation-iii',
    spritePasta: 'firered-leafgreen',
  },
  leafgreen: {
    id: 'leafgreen',
    nome: 'LeafGreen',
    cor: '#6DB33F',
    geracao: 3,
    maxId: 386,
    offline: true,
    ativo: true,
    baseOffline: 'firered', // usa os sprites e a lista do FireRed
    pokedexRegional: 'kanto',
    spriteGeracao: 'generation-iii',
    spritePasta: 'firered-leafgreen',
  },
  ruby: {
    id: 'ruby',
    nome: 'Ruby',
    cor: '#B3122D',
    geracao: 3,
    maxId: 386,
    offline: true,
    ativo: true,
    baseOffline: 'emerald', // usa os sprites e a lista do Emerald
    pokedexRegional: 'hoenn',
    spriteGeracao: 'generation-iii',
    spritePasta: 'ruby-sapphire',
  },
  sapphire: {
    id: 'sapphire',
    nome: 'Sapphire',
    cor: '#1E5BB8',
    geracao: 3,
    maxId: 386,
    offline: true,
    ativo: true,
    baseOffline: 'emerald', // usa os sprites e a lista do Emerald
    pokedexRegional: 'hoenn',
    spriteGeracao: 'generation-iii',
    spritePasta: 'ruby-sapphire',
  },
  emerald: {
    id: 'emerald',
    nome: 'Emerald',
    cor: '#2E9E5B',
    geracao: 3,
    maxId: 386,
    offline: true,
    ativo: true,
    pokedexRegional: 'hoenn',
    spriteGeracao: 'generation-iii',
    spritePasta: 'emerald',
  },

  // ----- ONLINE (geração 4) -----
  diamond: {
    id: 'diamond',
    nome: 'Diamond',
    cor: '#6C8EBF',
    geracao: 4,
    maxId: 493,
    offline: false,
    ativo: true,
    pokedexRegional: 'original-sinnoh',
    spriteGeracao: 'generation-iv',
    spritePasta: 'diamond-pearl',
  },
  pearl: {
    id: 'pearl',
    nome: 'Pearl',
    cor: '#C77DA3',
    geracao: 4,
    maxId: 493,
    offline: false,
    ativo: true,
    pokedexRegional: 'original-sinnoh',
    spriteGeracao: 'generation-iv',
    spritePasta: 'diamond-pearl',
  },
  platinum: {
    id: 'platinum',
    nome: 'Platinum',
    cor: '#7A7A8C',
    geracao: 4,
    maxId: 493,
    offline: false,
    ativo: true,
    pokedexRegional: 'extended-sinnoh',
    spriteGeracao: 'generation-iv',
    spritePasta: 'platinum',
  },
  heartgold: {
    id: 'heartgold',
    nome: 'HeartGold',
    cor: '#C9A227',
    geracao: 4,
    maxId: 493,
    offline: false,
    ativo: true,
    pokedexRegional: 'updated-johto',
    spriteGeracao: 'generation-iv',
    spritePasta: 'heartgold-soulsilver',
  },
  soulsilver: {
    id: 'soulsilver',
    nome: 'SoulSilver',
    cor: '#8F9AA8',
    geracao: 4,
    maxId: 493,
    offline: false,
    ativo: true,
    pokedexRegional: 'updated-johto',
    spriteGeracao: 'generation-iv',
    spritePasta: 'heartgold-soulsilver',
  },

  // ----- ONLINE (geração 5) -----
  black: {
    id: 'black',
    nome: 'Black',
    cor: '#333333',
    geracao: 5,
    maxId: 649,
    offline: false,
    ativo: true,
    pokedexRegional: 'original-unova',
    spriteGeracao: 'generation-v',
    spritePasta: 'black-white',
  },
  white: {
    id: 'white',
    nome: 'White',
    cor: '#8A94A6',
    geracao: 5,
    maxId: 649,
    offline: false,
    ativo: true,
    pokedexRegional: 'original-unova',
    spriteGeracao: 'generation-v',
    spritePasta: 'black-white',
  },
  black2: {
    id: 'black2',
    nome: 'Black 2',
    cor: '#1E3A5F',
    geracao: 5,
    maxId: 649,
    offline: false,
    ativo: true,
    pokedexRegional: 'updated-unova',
    spriteGeracao: 'generation-v',
    spritePasta: 'black-white',
  },
  white2: {
    id: 'white2',
    nome: 'White 2',
    cor: '#B85C38',
    geracao: 5,
    maxId: 649,
    offline: false,
    ativo: true,
    pokedexRegional: 'updated-unova',
    spriteGeracao: 'generation-v',
    spritePasta: 'black-white',
  },
};

// Só os jogos ativos (usado na Home para gerar os botões com map())
export const LISTA_JOGOS = Object.values(JOGOS).filter((jogo) => jogo.ativo);

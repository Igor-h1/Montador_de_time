// data/regioes.js
// Regiões da tela "Montar time" e os jogos de cada uma, na ordem em que aparecem.
// Para reordenar, mude a ordem das regiões ou dos ids. Um jogo que não esteja em
// nenhuma região aparece num grupo "Outros" no fim, então nenhum jogo some.

export const REGIOES = [
  { id: 'kanto', nome: 'Kanto', jogos: ['firered', 'leafgreen'] },
  { id: 'johto', nome: 'Johto', jogos: ['heartgold', 'soulsilver'] },
  { id: 'hoenn', nome: 'Hoenn', jogos: ['ruby', 'sapphire', 'emerald'] },
  { id: 'sinnoh', nome: 'Sinnoh', jogos: ['diamond', 'pearl', 'platinum'] },
  { id: 'unova', nome: 'Unova', jogos: ['black', 'white', 'black2', 'white2'] },
];

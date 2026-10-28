// data/jogos.js
// Jogos suportados pelo app. Para adicionar outro jogo no futuro,
// basta incluir um novo objeto aqui.

export const JOGOS = {
  firered: {
    id: 'firered',
    nome: 'FireRed',
    cor: '#E8452C',
    // pasta de sprites na PokéAPI (e em assets/sprites/)
    spritePasta: 'firered-leafgreen',
    // Pokédex regional usada para decidir quem está "disponível"
    pokedexRegional: 'kanto',
  },
  emerald: {
    id: 'emerald',
    nome: 'Emerald',
    cor: '#2E9E5B',
    spritePasta: 'emerald',
    pokedexRegional: 'hoenn',
  },
};

// Versão em lista, útil para gerar botões com map()
export const LISTA_JOGOS = Object.values(JOGOS);

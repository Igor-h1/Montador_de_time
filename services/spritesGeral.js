// services/spritesGeral.js
// Sprites da Pokédex geral (todos os 649 Pokémon), carregados da internet.
// Ordem de tentativa: Black/White (a PokéAPI tem uma só pasta da 5ª geração, que serve
// também ao Black 2/White 2), depois Platinum e depois HeartGold/SoulSilver. A tela
// passa para a próxima origem se a imagem não existir ou falhar ao carregar.

const BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions';

const ORIGENS = [
  { geracao: 'generation-v', pasta: 'black-white', maxId: 649 },
  { geracao: 'generation-iv', pasta: 'platinum', maxId: 493 },
  { geracao: 'generation-iv', pasta: 'heartgold-soulsilver', maxId: 493 },
];

// Reaproveitar a mesma lista de { uri } mantém o React.memo dos cards funcionando
const CACHE = {};

// Devolve a lista de fontes (na ordem de tentativa) do Pokémon
export function fontesSprite(id) {
  const numero = Number(id);
  if (!CACHE[numero]) {
    CACHE[numero] = ORIGENS.filter((origem) => numero <= origem.maxId).map((origem) => ({
      uri: `${BASE}/${origem.geracao}/${origem.pasta}/${numero}.png`,
    }));
  }
  return CACHE[numero];
}

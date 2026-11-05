// services/spritesGeral.js
// Sprites da Pokédex geral (todos os 649 Pokémon), carregados da internet, em duas
// versões: normal e SHINY.
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
const CACHE_SHINY = {};

function montar(id, shiny) {
  const numero = Number(id);
  const subpasta = shiny ? 'shiny/' : '';
  return ORIGENS.filter((origem) => numero <= origem.maxId).map((origem) => ({
    uri: `${BASE}/${origem.geracao}/${origem.pasta}/${subpasta}${numero}.png`,
  }));
}

// Devolve a lista de fontes (na ordem de tentativa) do Pokémon
export function fontesSprite(id) {
  const numero = Number(id);
  if (!CACHE[numero]) CACHE[numero] = montar(numero, false);
  return CACHE[numero];
}

// O mesmo, para o sprite SHINY
export function fontesSpriteShiny(id) {
  const numero = Number(id);
  if (!CACHE_SHINY[numero]) CACHE_SHINY[numero] = montar(numero, true);
  return CACHE_SHINY[numero];
}

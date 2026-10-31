// scripts/gerarDados.js
// Gera data/pokemons.js (índice leve: id, nome, slug, tipos) a partir da PokéAPI.
// Roda UMA vez no seu computador (NÃO faz parte do app). Precisa de Node 18+.
// Rode sempre da RAIZ do projeto:
//
//   node scripts/gerarDados.js teste   -> só alguns Pokémon, para conferir
//   node scripts/gerarDados.js         -> os 649 Pokémon (gerações 3, 4 e 5)
//
// Cada resposta da API fica guardada em scripts/cache/ (política de uso justo
// da PokéAPI). Se a internet cair, rode de novo: continua de onde parou.
//
// A disponibilidade por jogo só é gravada para os jogos OFFLINE (FireRed e
// Emerald): o valor é o NÚMERO do Pokémon na Pokédex regional do jogo (ou false
// se ele não está nela). A lista dos jogos online é buscada pelo app, na hora.

const fs = require('fs');
const path = require('path');

const API = 'https://pokeapi.co/api/v2';
const CACHE_DIR = path.join(__dirname, 'cache');
const SAIDA = path.join(__dirname, '..', 'data', 'pokemons.js');
const TOTAL = 649;
const PAUSA_MS = 100;
const IDS_TESTE = [35, 122, 252, 413, 439, 474, 487, 555, 648];

// Jogos offline -> Pokédex regional (mesma relação de data/jogos.js)
const DEX_POR_JOGO = { firered: 'kanto', emerald: 'hoenn' };

// Os 17 tipos das gerações 3 a 5 (sem Fairy)
const TIPOS_VALIDOS = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel',
];

const GERACOES = [
  'generation-i', 'generation-ii', 'generation-iii', 'generation-iv', 'generation-v',
  'generation-vi', 'generation-vii', 'generation-viii', 'generation-ix',
];
const INDICE_GERACAO_3 = GERACOES.indexOf('generation-iii');

// Alguns Pokémon vêm da API com o nome da FORMA (ex.: "wormadam-plant").
// Usamos o nome base, que também é o endereço no site do "Saiba mais".
const FORMAS_PADRAO = {
  'deoxys-normal': 'deoxys',
  'wormadam-plant': 'wormadam',
  'giratina-altered': 'giratina',
  'shaymin-land': 'shaymin',
  'basculin-red-striped': 'basculin',
  'darmanitan-standard': 'darmanitan',
  'tornadus-incarnate': 'tornadus',
  'thundurus-incarnate': 'thundurus',
  'landorus-incarnate': 'landorus',
  'keldeo-ordinary': 'keldeo',
  'meloetta-aria': 'meloetta',
};

// Nomes que não ficam certos só com a primeira letra maiúscula
const NOMES_ESPECIAIS = {
  'nidoran-f': 'Nidoran♀',
  'nidoran-m': 'Nidoran♂',
  'mr-mime': 'Mr. Mime',
  farfetchd: "Farfetch'd",
  'ho-oh': 'Ho-Oh',
  'mime-jr': 'Mime Jr.',
  'porygon-z': 'Porygon-Z',
};

// Os únicos nomes que podem ter hífen. Qualquer outro gera um AVISO.
const HIFEN_PERMITIDO = ['nidoran-f', 'nidoran-m', 'mr-mime', 'ho-oh', 'mime-jr', 'porygon-z'];

const dormir = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Busca na API (ou no cache). "reduzir" guarda só o que o app precisa,
// para o cache não ficar enorme.
async function buscarComCache(caminho, reduzir, nomeCache = caminho) {
  const arquivo = path.join(CACHE_DIR, nomeCache.replace(/[^a-z0-9]+/gi, '_') + '.json');
  if (fs.existsSync(arquivo)) {
    return JSON.parse(fs.readFileSync(arquivo, 'utf8'));
  }

  await dormir(PAUSA_MS);
  const resposta = await fetch(`${API}/${caminho}`);
  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status} em /${caminho}`);
  }
  const dados = reduzir(await resposta.json());
  fs.writeFileSync(arquivo, JSON.stringify(dados));
  return dados;
}

function buscarPokemon(id) {
  return buscarComCache(`pokemon/${id}`, (d) => ({
    id: d.id,
    name: d.name,
    types: d.types,
    past_types: d.past_types || [],
  }));
}

// Devolve um Map: id do Pokémon -> número dele na Pokédex regional (entry_number)
async function buscarPokedex(nome) {
  const dados = await buscarComCache(
    `pokedex/${nome}`,
    (d) => ({
      entradas: d.pokemon_entries.map((e) => [
        Number(e.pokemon_species.url.split('/').filter(Boolean).pop()),
        e.entry_number,
      ]),
    }),
    `pokedex-com-numeros/${nome}` // nome novo no cache: o antigo só guardava os ids
  );
  return new Map(dados.entradas);
}

// A API devolve os tipos ATUAIS. Usamos o campo past_types: cada entrada diz
// "até a geração X o Pokémon tinha estes tipos". Pegamos a entrada mais próxima
// que ainda cobre a geração 3 em diante (X >= 3). As gerações 3, 4 e 5 têm os
// mesmos tipos, então um único resultado serve para todos os jogos.
function tiposAntesDaGeracao6(pokemon) {
  const candidatos = pokemon.past_types
    .map((p) => ({ indice: GERACOES.indexOf(p.generation.name), types: p.types }))
    .filter((p) => p.indice >= INDICE_GERACAO_3)
    .sort((a, b) => a.indice - b.indice);

  const escolhidos = candidatos.length > 0 ? candidatos[0].types : pokemon.types;
  return [...escolhidos].sort((a, b) => a.slot - b.slot).map((t) => t.type.name);
}

function slugDoPokemon(nomeApi) {
  return FORMAS_PADRAO[nomeApi] || nomeApi;
}

function formatarNome(slug) {
  if (NOMES_ESPECIAIS[slug]) return NOMES_ESPECIAIS[slug];
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

async function main() {
  if (typeof fetch !== 'function') {
    console.error('Seu Node é antigo (precisa ser 18 ou superior). Rode: node -v');
    process.exit(1);
  }

  const modoTeste = process.argv[2] === 'teste';
  const ids = modoTeste
    ? IDS_TESTE
    : Array.from({ length: TOTAL }, (_, i) => i + 1);

  fs.mkdirSync(CACHE_DIR, { recursive: true });

  console.log('Buscando as Pokédex regionais dos jogos offline...');
  const dexPorJogo = {};
  for (const [jogo, dex] of Object.entries(DEX_POR_JOGO)) {
    dexPorJogo[jogo] = await buscarPokedex(dex);
    console.log(`  ${jogo} (${dex}): ${dexPorJogo[jogo].size} Pokémon na Pokédex`);
  }

  console.log(`Buscando ${ids.length} Pokémon...`);
  const lista = [];
  const avisos = [];

  for (const id of ids) {
    const p = await buscarPokemon(id);
    const tipos = tiposAntesDaGeracao6(p);
    const slug = slugDoPokemon(p.name);
    const nome = formatarNome(slug);

    tipos.forEach((tipo) => {
      if (!TIPOS_VALIDOS.includes(tipo)) {
        avisos.push(`#${id} ${p.name} tem um tipo fora das gerações 3 a 5: ${tipo}`);
      }
    });
    if (slug.includes('-') && !HIFEN_PERMITIDO.includes(slug)) {
      avisos.push(`#${id} o nome "${slug}" tem hífen: confira se precisa de ajuste`);
    }

    const disponibilidade = {};
    Object.keys(DEX_POR_JOGO).forEach((jogo) => {
      // número na Pokédex regional do jogo, ou false se o Pokémon não está nela
      disponibilidade[jogo] = dexPorJogo[jogo].get(id) || false;
    });

    lista.push({ id: p.id, nome, slug, tipos, disponibilidade });

    if (modoTeste) {
      console.log(
        `  #${p.id} ${nome} [${tipos.join(', ')}] (slug: ${slug}) ` +
          `| nº FireRed: ${disponibilidade.firered || '-'} | nº Emerald: ${disponibilidade.emerald || '-'}`
      );
    } else if (id % 50 === 0) {
      console.log(`  ${id}/${TOTAL}`);
    }
  }

  const linhas = lista.map((p) => '  ' + JSON.stringify(p));
  const conteudo =
    '// data/pokemons.js\n' +
    '// GERADO por scripts/gerarDados.js. Não edite à mão.\n\n' +
    `export const POKEMONS = [\n${linhas.join(',\n')},\n];\n`;
  fs.writeFileSync(SAIDA, conteudo);

  console.log(`\nPronto! ${lista.length} Pokémon gravados em data/pokemons.js`);
  const totalFR = lista.filter((p) => p.disponibilidade.firered).length;
  const totalEM = lista.filter((p) => p.disponibilidade.emerald).length;
  console.log(`Disponíveis: FireRed ${totalFR} | Emerald ${totalEM}`);

  if (avisos.length > 0) {
    console.log('\nAVISOS:');
    avisos.forEach((a) => console.log('  ' + a));
  }
}

main().catch((erro) => {
  console.error('\nErro:', erro.message);
  console.error('Rode de novo: o que já foi baixado está no cache.');
  process.exit(1);
});

// scripts/gerarDados.js
// Gera data/pokemons.js a partir da PokéAPI.
// Roda UMA vez no seu computador (NÃO faz parte do app). Precisa de Node 18+.
//
//   node scripts/gerarDados.js teste   -> só 7 Pokémon, para conferir
//   node scripts/gerarDados.js         -> os 386 Pokémon da geração 3
//
// Cada resposta da API fica guardada em scripts/cache/ (política de uso justo
// da PokéAPI). Se a internet cair, rode de novo: continua de onde parou.

const fs = require('fs');
const path = require('path');

const API = 'https://pokeapi.co/api/v2';
const CACHE_DIR = path.join(__dirname, 'cache');
const SAIDA = path.join(__dirname, '..', 'data', 'pokemons.js');
const TOTAL = 386;
const PAUSA_MS = 100;
const IDS_TESTE = [6, 25, 35, 122, 175, 227, 252];

// Mesma relação de data/jogos.js: jogo -> Pokédex regional
const DEX_POR_JOGO = { firered: 'kanto', emerald: 'hoenn' };

// Os 17 tipos da geração 3 (sem Fairy)
const TIPOS_VALIDOS = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel',
];

const GERACOES = [
  'generation-i', 'generation-ii', 'generation-iii', 'generation-iv', 'generation-v',
  'generation-vi', 'generation-vii', 'generation-viii', 'generation-ix',
];
const INDICE_GERACAO_3 = GERACOES.indexOf('generation-iii');

// Nomes que não ficam certos só com a primeira letra maiúscula
const NOMES_ESPECIAIS = {
  'nidoran-f': 'Nidoran♀',
  'nidoran-m': 'Nidoran♂',
  'mr-mime': 'Mr. Mime',
  farfetchd: "Farfetch'd",
  'ho-oh': 'Ho-Oh',
  'deoxys-normal': 'Deoxys',
};
const SLUGS_ESPECIAIS = { 'deoxys-normal': 'deoxys' };

const dormir = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Busca na API (ou no cache). "reduzir" guarda só o que o app precisa,
// para o cache não ficar enorme.
async function buscarComCache(caminho, reduzir) {
  const arquivo = path.join(CACHE_DIR, caminho.replace(/[^a-z0-9]+/gi, '_') + '.json');
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

// Devolve um Set com os ids da Pokédex regional
async function buscarPokedex(nome) {
  const dados = await buscarComCache(`pokedex/${nome}`, (d) => ({
    ids: d.pokemon_entries.map((e) =>
      Number(e.pokemon_species.url.split('/').filter(Boolean).pop())
    ),
  }));
  return new Set(dados.ids);
}

// A API devolve os tipos ATUAIS. Para a geração 3 usamos o campo past_types:
// cada entrada diz "até a geração X o Pokémon tinha estes tipos".
// Pegamos a entrada mais próxima que ainda cobre a geração 3 (ou seja, X >= 3).
function tiposNaGeracao3(pokemon) {
  const candidatos = pokemon.past_types
    .map((p) => ({ indice: GERACOES.indexOf(p.generation.name), types: p.types }))
    .filter((p) => p.indice >= INDICE_GERACAO_3)
    .sort((a, b) => a.indice - b.indice);

  const escolhidos = candidatos.length > 0 ? candidatos[0].types : pokemon.types;
  return [...escolhidos].sort((a, b) => a.slot - b.slot).map((t) => t.type.name);
}

function formatarNome(nomeApi) {
  if (NOMES_ESPECIAIS[nomeApi]) return NOMES_ESPECIAIS[nomeApi];
  return nomeApi.charAt(0).toUpperCase() + nomeApi.slice(1);
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

  console.log('Buscando as Pokédex regionais...');
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
    const tipos = tiposNaGeracao3(p);

    tipos.forEach((tipo) => {
      if (!TIPOS_VALIDOS.includes(tipo)) {
        avisos.push(`#${id} ${p.name} tem um tipo fora da geração 3: ${tipo}`);
      }
    });

    const disponibilidade = {};
    Object.keys(DEX_POR_JOGO).forEach((jogo) => {
      disponibilidade[jogo] = dexPorJogo[jogo].has(id);
    });

    lista.push({
      id: p.id,
      nome: formatarNome(p.name),
      slug: SLUGS_ESPECIAIS[p.name] || p.name,
      tipos,
      disponibilidade,
    });

    if (modoTeste) {
      const d = disponibilidade;
      console.log(
        `  #${p.id} ${formatarNome(p.name)} [${tipos.join(', ')}] ` +
          `FireRed: ${d.firered ? 'sim' : 'não'} | Emerald: ${d.emerald ? 'sim' : 'não'}`
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

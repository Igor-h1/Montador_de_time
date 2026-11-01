// scripts/baixarIconesTipos.js
// Baixa os ícones originais dos tipos do Pokémon Diamond/Pearl (rótulos "FIRE",
// "WATER"...) para assets/tipos/ e gera data/iconesTiposMap.js. O app usa esse mesmo
// conjunto em TODOS os jogos. Roda no seu computador (NÃO faz parte do app).
// Precisa de Node 18+. Rode da RAIZ do projeto:
//
//   node scripts/baixarIconesTipos.js
//
// Os números dos tipos (usados nos endereços das imagens) são lidos da própria
// PokéAPI. Arquivos que já existem são pulados.

const fs = require('fs');
const path = require('path');

const API = 'https://pokeapi.co/api/v2';
const BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-iv/diamond-pearl';
const RAIZ = path.join(__dirname, '..');
const PASTA_ICONES = path.join(RAIZ, 'assets', 'tipos');
const SAIDA_MAPA = path.join(RAIZ, 'data', 'iconesTiposMap.js');

const TIPOS = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel',
];

// Largura e altura de um PNG, lidas do cabeçalho do arquivo
function tamanhoPng(buffer) {
  return { largura: buffer.readUInt32BE(16), altura: buffer.readUInt32BE(20) };
}

async function baixar(url, destino) {
  for (let tentativa = 1; tentativa <= 2; tentativa++) {
    try {
      const resposta = await fetch(url);
      if (resposta.status === 404) return 'nao-existe';
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      fs.writeFileSync(destino, Buffer.from(await resposta.arrayBuffer()));
      return 'ok';
    } catch (erro) {
      if (tentativa === 2) return `erro: ${erro.message}`;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}

async function buscarIdsDosTipos() {
  const resposta = await fetch(`${API}/type?limit=100`);
  if (!resposta.ok) throw new Error(`A API respondeu ${resposta.status} em /type`);
  const dados = await resposta.json();

  const ids = {};
  dados.results.forEach((tipo) => {
    ids[tipo.name] = Number(tipo.url.split('/').filter(Boolean).pop());
  });
  const faltando = TIPOS.filter((tipo) => !ids[tipo]);
  if (faltando.length > 0) throw new Error(`Tipos não encontrados na API: ${faltando.join(', ')}`);
  return ids;
}

function gerarMapa() {
  let texto =
    '// data/iconesTiposMap.js\n' +
    '// GERADO por scripts/baixarIconesTipos.js. Não edite à mão.\n' +
    '// Ícones originais dos tipos (Diamond/Pearl), usados em todos os jogos.\n' +
    '// O require precisa de caminhos fixos, por isso este mapa existe.\n\n' +
    'export const ICONES_TIPOS = {\n';

  let total = 0;
  TIPOS.forEach((tipo) => {
    if (fs.existsSync(path.join(PASTA_ICONES, `${tipo}.png`))) {
      texto += `  ${tipo}: require('../assets/tipos/${tipo}.png'),\n`;
      total++;
    }
  });
  texto += '};\n';

  fs.writeFileSync(SAIDA_MAPA, texto);
  return total;
}

async function main() {
  if (typeof fetch !== 'function') {
    console.error('Seu Node é antigo (precisa ser 18 ou superior). Rode: node -v');
    process.exit(1);
  }

  fs.mkdirSync(PASTA_ICONES, { recursive: true });

  console.log('Lendo os números dos tipos na PokéAPI...');
  const ids = await buscarIdsDosTipos();
  console.log('  ' + TIPOS.map((tipo) => `${tipo}=${ids[tipo]}`).join(' '));

  const problemas = [];
  let novos = 0;
  let jaExistiam = 0;
  for (const tipo of TIPOS) {
    const destino = path.join(PASTA_ICONES, `${tipo}.png`);
    if (fs.existsSync(destino)) {
      jaExistiam++;
      continue;
    }
    const resultado = await baixar(`${BASE}/${ids[tipo]}.png`, destino);
    if (resultado === 'ok') novos++;
    else problemas.push(`${tipo}: ${resultado}`);
  }
  console.log(`\nÍcones: novos ${novos} | já existiam ${jaExistiam}`);

  // Tamanho dos ícones (útil para ajustar o visual)
  const exemplo = path.join(PASTA_ICONES, 'fire.png');
  if (fs.existsSync(exemplo)) {
    const { largura, altura } = tamanhoPng(fs.readFileSync(exemplo));
    console.log(`Tamanho do ícone: ${largura}x${altura} px`);
  }

  const total = gerarMapa();
  console.log(`\nMapa gerado em data/iconesTiposMap.js: ${total} de ${TIPOS.length} ícones`);

  if (problemas.length > 0) {
    console.log(`\nPROBLEMAS (${problemas.length}):`);
    problemas.forEach((p) => console.log('  ' + p));
    console.log('Rode de novo para tentar outra vez. Tipos sem ícone usam o emoji.');
  }
}

main().catch((erro) => {
  console.error('\nErro:', erro.message);
  process.exit(1);
});

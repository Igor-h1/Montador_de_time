// scripts/baixarIconesTipos.js
// Baixa os ícones originais dos tipos (rótulos "FIRE", "WATER"...) dos jogos OFFLINE
// para assets/tipos/ e gera data/iconesTiposMap.js. Roda no seu computador (NÃO faz
// parte do app). Precisa de Node 18+. Rode da RAIZ do projeto:
//
//   node scripts/baixarIconesTipos.js
//
// Os números dos tipos (usados nos endereços dos ícones dos jogos online) são lidos da
// própria PokéAPI, então não dependem de uma tabela escrita à mão.
// Arquivos que já existem são pulados.

const fs = require('fs');
const path = require('path');

const API = 'https://pokeapi.co/api/v2';
const BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-iii';
const RAIZ = path.join(__dirname, '..');
const PASTA_ICONES = path.join(RAIZ, 'assets', 'tipos');
const SAIDA_MAPA = path.join(RAIZ, 'data', 'iconesTiposMap.js');

// Mesma relação de data/jogos.js: jogo offline -> pasta de ícones na PokéAPI.
// (LeafGreen usa os do FireRed; Ruby e Sapphire usam os do Emerald, via baseOffline.)
const PASTAS = { firered: 'firered-leafgreen', emerald: 'emerald' };

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

  const resultado = {};
  TIPOS.forEach((tipo) => (resultado[tipo] = ids[tipo]));
  return resultado;
}

function gerarMapa(ids) {
  let texto =
    '// data/iconesTiposMap.js\n' +
    '// GERADO por scripts/baixarIconesTipos.js. Não edite à mão.\n' +
    '// IDS_TIPOS: número de cada tipo na PokéAPI (usado nos ícones dos jogos online).\n' +
    '// ICONES_TIPOS: ícones embutidos dos jogos offline (o require precisa de caminhos fixos).\n\n' +
    'export const IDS_TIPOS = {\n';
  TIPOS.forEach((tipo) => (texto += `  ${tipo}: ${ids[tipo]},\n`));
  texto += '};\n\nexport const ICONES_TIPOS = {\n';

  const contagem = {};
  for (const jogo of Object.keys(PASTAS)) {
    texto += `  ${jogo}: {\n`;
    contagem[jogo] = 0;
    TIPOS.forEach((tipo) => {
      if (fs.existsSync(path.join(PASTA_ICONES, jogo, `${tipo}.png`))) {
        texto += `    ${tipo}: require('../assets/tipos/${jogo}/${tipo}.png'),\n`;
        contagem[jogo]++;
      }
    });
    texto += '  },\n';
  }
  texto += '};\n';

  fs.writeFileSync(SAIDA_MAPA, texto);
  return contagem;
}

async function main() {
  if (typeof fetch !== 'function') {
    console.error('Seu Node é antigo (precisa ser 18 ou superior). Rode: node -v');
    process.exit(1);
  }

  console.log('Lendo os números dos tipos na PokéAPI...');
  const ids = await buscarIdsDosTipos();
  console.log('  ' + TIPOS.map((tipo) => `${tipo}=${ids[tipo]}`).join(' '));

  const problemas = [];
  for (const [jogo, pasta] of Object.entries(PASTAS)) {
    const destinoPasta = path.join(PASTA_ICONES, jogo);
    fs.mkdirSync(destinoPasta, { recursive: true });

    let novos = 0;
    let jaExistiam = 0;
    for (const tipo of TIPOS) {
      const destino = path.join(destinoPasta, `${tipo}.png`);
      if (fs.existsSync(destino)) {
        jaExistiam++;
        continue;
      }
      const resultado = await baixar(`${BASE}/${pasta}/${ids[tipo]}.png`, destino);
      if (resultado === 'ok') novos++;
      else problemas.push(`${jogo} ${tipo}: ${resultado}`);
    }
    console.log(`\n${jogo} (${pasta}): novos ${novos} | já existiam ${jaExistiam}`);

    // Tamanho dos ícones (útil para ajustar o visual)
    const exemplo = path.join(destinoPasta, 'fire.png');
    if (fs.existsSync(exemplo)) {
      const { largura, altura } = tamanhoPng(fs.readFileSync(exemplo));
      console.log(`  tamanho do ícone: ${largura}x${altura} px`);
    }
  }

  const contagem = gerarMapa(ids);
  console.log('\nMapa gerado em data/iconesTiposMap.js');
  Object.entries(contagem).forEach(([jogo, total]) =>
    console.log(`  ${jogo}: ${total} de ${TIPOS.length} ícones no mapa`)
  );

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

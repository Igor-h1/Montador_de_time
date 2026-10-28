// scripts/baixarSprites.js
// Baixa os sprites de FireRed e Emerald para assets/sprites/ e gera
// data/spritesMap.js (o require() do React Native precisa de caminhos fixos).
// Roda no seu computador (NÃO faz parte do app). Precisa de Node 18+.
//
//   node scripts/baixarSprites.js teste   -> só 4 Pokémon, para conferir a URL
//   node scripts/baixarSprites.js         -> os 386 Pokémon, nos 2 jogos
//
// Arquivos que já existem são pulados, então pode rodar de novo sem medo.

const fs = require('fs');
const path = require('path');

const BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii';
const RAIZ = path.join(__dirname, '..');
const PASTA_SPRITES = path.join(RAIZ, 'assets', 'sprites');
const SAIDA_MAPA = path.join(RAIZ, 'data', 'spritesMap.js');
const TOTAL = 386;
const LOTE = 5; // downloads simultâneos
const PAUSA_MS = 100;
const IDS_TESTE = [6, 35, 94, 252];

// Mesma relação de data/jogos.js: jogo -> pasta de sprites
const PASTAS = { firered: 'firered-leafgreen', emerald: 'emerald' };

const dormir = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
      await dormir(500);
    }
  }
}

function gerarMapa() {
  let texto =
    '// data/spritesMap.js\n' +
    '// GERADO por scripts/baixarSprites.js. Não edite à mão.\n' +
    '// O require() não aceita caminho dinâmico, por isso este mapa existe.\n\n' +
    'export const SPRITES = {\n';

  const contagem = {};
  for (const jogo of Object.keys(PASTAS)) {
    texto += `  ${jogo}: {\n`;
    contagem[jogo] = 0;
    for (let id = 1; id <= TOTAL; id++) {
      if (fs.existsSync(path.join(PASTA_SPRITES, jogo, `${id}.png`))) {
        texto += `    ${id}: require('../assets/sprites/${jogo}/${id}.png'),\n`;
        contagem[jogo]++;
      }
    }
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

  const ids = process.argv[2] === 'teste'
    ? IDS_TESTE
    : Array.from({ length: TOTAL }, (_, i) => i + 1);

  const problemas = [];

  for (const [jogo, pasta] of Object.entries(PASTAS)) {
    const destinoPasta = path.join(PASTA_SPRITES, jogo);
    fs.mkdirSync(destinoPasta, { recursive: true });

    console.log(`\n${jogo}: baixando ${ids.length} sprites (${pasta})...`);
    let baixados = 0;
    let jaExistiam = 0;

    for (let i = 0; i < ids.length; i += LOTE) {
      const lote = ids.slice(i, i + LOTE);
      await Promise.all(
        lote.map(async (id) => {
          const destino = path.join(destinoPasta, `${id}.png`);
          if (fs.existsSync(destino)) {
            jaExistiam++;
            return;
          }
          const resultado = await baixar(`${BASE}/${pasta}/${id}.png`, destino);
          if (resultado === 'ok') baixados++;
          else problemas.push(`${jogo} #${id}: ${resultado}`);
        })
      );
      await dormir(PAUSA_MS);
      if ((i / LOTE) % 20 === 19) console.log(`  ${Math.min(i + LOTE, ids.length)}/${ids.length}`);
    }

    console.log(`  novos: ${baixados} | já existiam: ${jaExistiam}`);
  }

  const contagem = gerarMapa();
  console.log('\nMapa gerado em data/spritesMap.js');
  Object.entries(contagem).forEach(([jogo, total]) =>
    console.log(`  ${jogo}: ${total} sprites no mapa`)
  );

  if (problemas.length > 0) {
    console.log(`\nPROBLEMAS (${problemas.length}):`);
    problemas.slice(0, 20).forEach((p) => console.log('  ' + p));
    if (problemas.length > 20) console.log(`  ... e mais ${problemas.length - 20}`);
    console.log('Rode de novo para tentar outra vez os que falharam.');
  }
}

main().catch((erro) => {
  console.error('\nErro:', erro.message);
  process.exit(1);
});

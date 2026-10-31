// scripts/verificarElite4.js
// Confere data/elite4.js contra data/pokemons.js (o índice gerado pela PokéAPI):
//  - nomes de Pokémon da Elite dos 4 que não existem no índice (ficariam sem sprite)
//  - tipos que não batem com os do índice
// Rode da RAIZ do projeto:   node scripts/verificarElite4.js

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const RAIZ = path.join(__dirname, '..');
const TEMP = path.join(__dirname, 'cache');

// Os arquivos de data/ são ES modules; copiamos para .mjs para o Node conseguir importar
async function carregar(arquivo) {
  fs.mkdirSync(TEMP, { recursive: true });
  const copia = path.join(TEMP, 'tmp_' + path.basename(arquivo, '.js') + '.mjs');
  fs.copyFileSync(path.join(RAIZ, arquivo), copia);
  return import(pathToFileURL(copia).href);
}

const normalizar = (nome) => nome.toLowerCase().replace(/[^a-z0-9]/g, '');

async function main() {
  const { POKEMONS } = await carregar('data/pokemons.js');
  const { ELITE4 } = await carregar('data/elite4.js');
  const porNome = new Map(POKEMONS.map((p) => [normalizar(p.nome), p]));

  let semNome = 0;
  let tiposDiferentes = 0;
  let total = 0;
  const jaVistos = new Set(); // jogos pares (ex.: Diamond e Pearl) compartilham o mesmo objeto

  for (const [jogo, dados] of Object.entries(ELITE4)) {
    if (jaVistos.has(dados)) continue;
    jaVistos.add(dados);

    for (const treinador of dados.treinadores) {
      for (const pokemon of treinador.pokemons) {
        total++;
        const base = porNome.get(normalizar(pokemon.nome));
        if (!base) {
          console.log(`NOME NÃO ENCONTRADO: ${pokemon.nome} (${jogo}, ${treinador.nome})`);
          semNome++;
          continue;
        }
        const daElite = [...pokemon.tipos].sort().join('/');
        const doIndice = [...base.tipos].sort().join('/');
        if (daElite !== doIndice) {
          console.log(
            `TIPOS DIFERENTES: ${pokemon.nome} (${jogo}, ${treinador.nome}) ` +
              `elite4=${daElite} | índice=${doIndice}`
          );
          tiposDiferentes++;
        }
      }
    }
  }

  console.log(
    `\n${total} Pokémon conferidos | nomes não encontrados: ${semNome} | tipos diferentes: ${tiposDiferentes}`
  );
  if (semNome === 0 && tiposDiferentes === 0) console.log('Tudo certo!');
}

main().catch((erro) => {
  console.error('Erro:', erro.message);
  process.exit(1);
});

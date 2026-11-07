// scripts/gerarEvolucoes.js
// Gera data/evolucoes.js: de quem cada Pokémon evolui, para quem ele evolui e o MÉTODO
// em texto curto, a partir das cadeias de evolução da PokéAPI. Roda UMA vez no seu
// computador (NÃO faz parte do app). Precisa de Node 18+. Rode da RAIZ do projeto:
//
//   node scripts/gerarEvolucoes.js teste   -> só as 60 primeiras cadeias (confere o formato)
//   node scripts/gerarEvolucoes.js         -> todas as cadeias (uns 550 pedidos, 1 a 2 minutos)
//
// Métodos comuns viram texto simples: "nível 16", "Pedra do Fogo", "troca" (ou "troca
// segurando Metal Coat") e "felicidade" (com "de dia" / "de noite"). O que for raro
// (golpe conhecido, local, beleza, etc.) vira "condição especial".
// A PokéAPI traz o método de VÁRIOS jogos; usamos o da geração mais recente até a 5ª.
// Só entram Pokémon de 1 a 649 (o que o app conhece).

const fs = require('fs');
const path = require('path');

const API = 'https://pokeapi.co/api/v2';
const CACHE_DIR = path.join(__dirname, 'cache');
const SAIDA = path.join(__dirname, '..', 'data', 'evolucoes.js');
const TOTAL = 649;
const PAUSA_MS = 100;
const TESTE_CADEIAS = 60;

const ESPECIAL = 'condição especial';

// Geração de cada grupo de jogos (para escolher o método certo até a 5ª geração)
const GERACAO_DO_JOGO = {
  'red-blue': 1, yellow: 1,
  'gold-silver': 2, crystal: 2,
  'ruby-sapphire': 3, emerald: 3, 'firered-leafgreen': 3, colosseum: 3, xd: 3,
  'diamond-pearl': 4, platinum: 4, 'heartgold-soulsilver': 4,
  'black-white': 5, 'black-2-white-2': 5,
};

// Itens de evolução com nome em português (pedras)
const ITENS_PT = {
  'fire-stone': 'Pedra do Fogo',
  'water-stone': 'Pedra da Água',
  'thunder-stone': 'Pedra do Trovão',
  'leaf-stone': 'Pedra da Folha',
  'moon-stone': 'Pedra da Lua',
  'sun-stone': 'Pedra do Sol',
  'shiny-stone': 'Pedra Brilhante',
  'dusk-stone': 'Pedra do Anoitecer',
  'dawn-stone': 'Pedra do Amanhecer',
};
// Os demais itens ficam em inglês (como os nomes dos Pokémon e golpes), com a grafia certa
const ITENS_EN = {
  'kings-rock': "King's Rock",
  'metal-coat': 'Metal Coat',
  'dragon-scale': 'Dragon Scale',
  'up-grade': 'Up-Grade',
  'deep-sea-tooth': 'Deep Sea Tooth',
  'deep-sea-scale': 'Deep Sea Scale',
  protector: 'Protector',
  electirizer: 'Electirizer',
  magmarizer: 'Magmarizer',
  'dubious-disc': 'Dubious Disc',
  'reaper-cloth': 'Reaper Cloth',
  'razor-claw': 'Razor Claw',
  'razor-fang': 'Razor Fang',
  'oval-stone': 'Oval Stone',
  'prism-scale': 'Prism Scale',
};

const dormir = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Busca na API (ou no cache). "reduzir" guarda só o que precisamos.
async function buscarComCache(caminho, reduzir, nomeCache = caminho) {
  const arquivo = path.join(CACHE_DIR, nomeCache.replace(/[^a-z0-9]+/gi, '_') + '.json');
  if (fs.existsSync(arquivo)) return JSON.parse(fs.readFileSync(arquivo, 'utf8'));

  await dormir(PAUSA_MS);
  const resposta = await fetch(`${API}/${caminho}`);
  if (!resposta.ok) throw new Error(`A API respondeu ${resposta.status} em /${caminho}`);
  const dados = reduzir(await resposta.json());
  fs.writeFileSync(arquivo, JSON.stringify(dados));
  return dados;
}

const idDaUrl = (url) => Number(url.split('/').filter(Boolean).pop());
const nome = (recurso) => (recurso ? recurso.name : null);

// Guarda um detalhe de evolução só com os campos que usamos
function reduzirDetalhe(d) {
  const grupo = d.version_group ? nome(d.version_group) : null;
  return {
    geracao: grupo === null ? 0 : GERACAO_DO_JOGO[grupo] || 99,
    gatilho: nome(d.trigger),
    nivel: d.min_level,
    felicidade: d.min_happiness,
    item: nome(d.item),
    itemSegurado: nome(d.held_item),
    genero: d.gender,
    periodo: d.time_of_day || '',
    // qualquer uma destas condições torna a evolução "especial"
    extras: [
      d.known_move, d.known_move_type, d.location, d.party_species, d.party_type,
      d.relative_physical_stats !== null && d.relative_physical_stats !== undefined,
      d.min_beauty, d.min_affection, d.trade_species,
      d.needs_overworld_rain, d.turn_upside_down,
      d.min_steps, d.min_move_count, d.min_damage_taken, d.region, d.used_move,
      d.allowed_natures, d.required_pokemon_form, d.condition_expression,
    ].some((valor) => Boolean(valor)),
  };
}

// Guarda a árvore da cadeia só com o que precisamos
function reduzirNo(no) {
  return {
    id: idDaUrl(no.species.url),
    nome: no.species.name,
    detalhes: (no.evolution_details || []).map(reduzirDetalhe),
    filhos: (no.evolves_to || []).map(reduzirNo),
  };
}

function itemEmTexto(slug) {
  if (ITENS_PT[slug]) return ITENS_PT[slug];
  if (ITENS_EN[slug]) return ITENS_EN[slug];
  return slug.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
}

// Entre os detalhes de uma evolução, usa o da geração mais recente até a 5ª.
// Se todos forem de gerações mais novas, usa o primeiro.
function escolherDetalhe(lista) {
  if (lista.length === 0) return null;
  const ateA5 = lista.filter((d) => d.geracao <= 5);
  if (ateA5.length === 0) return lista[0];
  return ateA5.reduce((melhor, d) => (d.geracao >= melhor.geracao ? d : melhor));
}

// Texto curto do método de evolução
function textoDoMetodo(d) {
  if (!d || d.extras) return ESPECIAL;

  const genero = d.genero === 1 ? ' (só fêmea)' : d.genero === 2 ? ' (só macho)' : '';

  if (d.gatilho === 'level-up') {
    if (d.itemSegurado) return ESPECIAL;
    if (d.felicidade) {
      const periodo = d.periodo === 'day' ? ' (de dia)' : d.periodo === 'night' ? ' (de noite)' : '';
      return `felicidade${periodo}${genero}`;
    }
    if (d.periodo) return ESPECIAL;
    if (d.nivel) return `nível ${d.nivel}${genero}`;
    return ESPECIAL;
  }
  if (d.gatilho === 'use-item') {
    if (d.item && !d.itemSegurado && !d.periodo && !d.felicidade) return `${itemEmTexto(d.item)}${genero}`;
    return ESPECIAL;
  }
  if (d.gatilho === 'trade') {
    if (d.periodo || d.felicidade) return ESPECIAL;
    return d.itemSegurado ? `troca segurando ${itemEmTexto(d.itemSegurado)}` : 'troca';
  }
  return ESPECIAL; // shed, spin, etc.
}

// Percorre a árvore e junta as relações. "resultado[id] = { de, para }"
function juntarRelacoes(no, resultado, revisao) {
  no.filhos.forEach((filho) => {
    if (no.id <= TOTAL && filho.id <= TOTAL) {
      const escolhido = escolherDetalhe(filho.detalhes);
      const metodo = textoDoMetodo(escolhido);

      resultado[no.id] = resultado[no.id] || { de: null, para: [] };
      resultado[filho.id] = resultado[filho.id] || { de: null, para: [] };
      resultado[no.id].para.push({ id: filho.id, metodo });
      resultado[filho.id].de = { id: no.id, metodo };

      const geracoes = new Set(filho.detalhes.map((d) => d.geracao));
      revisao.push({ de: no.nome, para: filho.nome, metodo, varios: filho.detalhes.length > 1, geracoes: geracoes.size });
    }
    juntarRelacoes(filho, resultado, revisao);
  });
}

const js = (s) => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";

async function main() {
  if (typeof fetch !== 'function') {
    console.error('Seu Node é antigo (precisa ser 18 ou superior). Rode: node -v');
    process.exit(1);
  }
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const modoTeste = process.argv[2] === 'teste';

  console.log('Lendo a lista de cadeias de evolução...');
  const lista = await buscarComCache(
    'evolution-chain?limit=1000',
    (d) => ({ ids: d.results.map((r) => idDaUrl(r.url)) }),
    'evolution-chain-lista'
  );
  const ids = (modoTeste ? lista.ids.slice(0, TESTE_CADEIAS) : lista.ids).sort((a, b) => a - b);
  console.log(`  ${lista.ids.length} cadeias na API; processando ${ids.length}.`);

  const resultado = {};
  const revisao = [];
  let feitas = 0;
  for (const id of ids) {
    const cadeia = await buscarComCache(
      `evolution-chain/${id}`,
      (d) => reduzirNo(d.chain),
      `evolution-chain-compacta/${id}`
    );
    juntarRelacoes(cadeia, resultado, revisao);
    feitas++;
    if (!modoTeste && feitas % 100 === 0) console.log(`  ${feitas}/${ids.length}`);
  }

  // ---- grava data/evolucoes.js ----
  const linhas = Object.keys(resultado)
    .map(Number)
    .sort((a, b) => a - b)
    .map((id) => {
      const r = resultado[id];
      const de = r.de ? `{ id: ${r.de.id}, metodo: ${js(r.de.metodo)} }` : 'null';
      const para = r.para.map((e) => `{ id: ${e.id}, metodo: ${js(e.metodo)} }`).join(', ');
      return `  ${id}: { de: ${de}, para: [${para}] },`;
    });
  const conteudo =
    '// data/evolucoes.js\n' +
    '// GERADO por scripts/gerarEvolucoes.js. Não edite à mão.\n' +
    '// Para cada Pokémon: de quem ele evolui (de) e para quem ele evolui (para), com o método\n' +
    '// em texto curto. Pokémon sem evolução nem pré-evolução não aparecem aqui.\n\n' +
    `export const EVOLUCOES = {\n${linhas.join('\n')}\n};\n`;
  fs.writeFileSync(SAIDA, conteudo);

  // ---- resumo para você conferir ----
  const contagem = { nível: 0, Pedra: 0, troca: 0, felicidade: 0, especial: 0 };
  revisao.forEach((r) => {
    if (r.metodo === ESPECIAL) contagem.especial++;
    else if (r.metodo.startsWith('nível')) contagem['nível']++;
    else if (r.metodo.startsWith('Pedra')) contagem.Pedra++;
    else if (r.metodo.startsWith('troca')) contagem.troca++;
    else if (r.metodo.startsWith('felicidade')) contagem.felicidade++;
  });
  console.log(`\nPronto! ${Object.keys(resultado).length} Pokémon com evolução gravados em data/evolucoes.js`);
  console.log(`Métodos (${revisao.length} evoluções): ${JSON.stringify(contagem)}`);

  const especiais = revisao.filter((r) => r.metodo === ESPECIAL).map((r) => `${r.de} -> ${r.para}`);
  console.log(`\n"condição especial" (${especiais.length}): ${especiais.join(', ') || '-'}`);

  const varios = revisao.filter((r) => r.varios && r.geracoes > 1).map((r) => `${r.de} -> ${r.para}: ${r.metodo}`);
  if (varios.length > 0) {
    console.log(`\nEvoluções com métodos diferentes entre gerações (escolhido o da mais recente até a 5ª): ${varios.length}`);
    varios.slice(0, 25).forEach((v) => console.log('  ' + v));
    if (varios.length > 25) console.log(`  ... e mais ${varios.length - 25}`);
  }
}

main().catch((erro) => {
  console.error('\nErro:', erro.message);
  console.error('Rode de novo: o que já foi baixado está no cache.');
  process.exit(1);
});

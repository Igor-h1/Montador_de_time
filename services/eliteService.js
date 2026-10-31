// services/eliteService.js
// Estima como a equipe do jogador se sai contra a Elite dos 4 e o campeão,
// olhando SÓ os tipos (não considera nível, golpes, habilidades nem itens).
//
// Como funciona, para cada treinador:
//  1. Para cada Pokémon dele, procura o MELHOR confronto entre os Pokémon da sua equipe.
//     Um confronto vale  log2(dano que você causa) - log2(dano que você recebe),
//     usando o melhor tipo de cada lado (ex.: 2x causando e 1x recebendo = +1).
//  2. A nota do treinador é a média dessas respostas.
//  3. Nota positiva = vantagem (verde); negativa = desvantagem (vermelho);
//     perto de zero = neutro (sem cor). Quanto maior o valor, mais quadrados.
//
// Esta função não depende da tela nem do restante do app (recebe a equipe pronta).

import { ELITE4 } from '../data/elite4';
import { multiplicador } from '../data/tipos';

// ---- Ajustes da estimativa (tudo aqui, para calibrar fácil) ----
const PISO = 0.125; // imunidade (0x) conta como 1/8, para o log2 não quebrar
const MARGEM_NEUTRA = 0.2; // nota abaixo disso (em módulo) = neutro, sem quadrados
const PASSO_QUADRADO = 0.5; // cada quadrado vale 0,5 de nota
export const QUADRADOS_MAX = 5;
const LIMITE_CONFRONTO = 0.5; // a partir daqui um Pokémon dele conta como vantagem/desvantagem

// Dificuldade geral, pela média das notas (do mais fácil para o mais difícil)
const NIVEIS = [
  { minimo: 0.8, chave: 'facil', rotulo: 'Fácil' },
  { minimo: 0.2, chave: 'media', rotulo: 'Média' },
  { minimo: -0.4, chave: 'dificil', rotulo: 'Difícil' },
  { minimo: -Infinity, chave: 'muito-dificil', rotulo: 'Muito difícil' },
];

export function obterElite(jogoId) {
  return ELITE4[jogoId] || null;
}

// Maior multiplicador que um Pokémon (pelos seus tipos) causa em um alvo
function melhorMultiplicador(tiposAtacante, tiposAlvo) {
  return tiposAtacante.reduce(
    (maior, tipo) => Math.max(maior, multiplicador(tipo, tiposAlvo)),
    0
  );
}

// Positivo = o seu Pokémon leva vantagem contra o inimigo; negativo = desvantagem
function valorConfronto(meu, inimigo) {
  const ataque = melhorMultiplicador(meu.tipos, inimigo.tipos);
  const defesa = melhorMultiplicador(inimigo.tipos, meu.tipos);
  return Math.log2(Math.max(ataque, PISO)) - Math.log2(Math.max(defesa, PISO));
}

// Transforma uma nota em { sentido, quadrados }
export function medidor(nota) {
  const modulo = Math.abs(nota);
  if (modulo < MARGEM_NEUTRA) return { sentido: 'neutro', quadrados: 0 };
  return {
    sentido: nota > 0 ? 'vantagem' : 'desvantagem',
    quadrados: Math.min(QUADRADOS_MAX, Math.ceil(modulo / PASSO_QUADRADO)),
  };
}

function sentidoDoConfronto(valor) {
  if (valor >= LIMITE_CONFRONTO) return 'vantagem';
  if (valor <= -LIMITE_CONFRONTO) return 'desvantagem';
  return 'neutro';
}

function media(valores) {
  return valores.length === 0 ? 0 : valores.reduce((a, b) => a + b, 0) / valores.length;
}

function analisarTreinador(treinador, equipe) {
  const pokemons = treinador.pokemons.map((inimigo) => {
    if (equipe.length === 0) return { ...inimigo, melhor: null, valor: 0, sentido: 'neutro' };

    // Melhor resposta da sua equipe contra este Pokémon
    let melhor = null;
    equipe.forEach((meu) => {
      const valor = valorConfronto(meu, inimigo);
      if (melhor === null || valor > melhor.valor) melhor = { nome: meu.nome, valor };
    });
    return { ...inimigo, melhor: melhor.nome, valor: melhor.valor, sentido: sentidoDoConfronto(melhor.valor) };
  });

  const nota = media(pokemons.map((p) => p.valor));
  return { ...treinador, pokemons, nota, ...medidor(nota) };
}

// Análise completa de um jogo. "equipe" = lista de { nome, tipos }.
// Devolve null se o jogo não tiver dados da Elite dos 4.
export function analisarElite(jogoId, equipe) {
  const dados = ELITE4[jogoId];
  if (!dados) return null;

  const treinadores = dados.treinadores.map((t) => analisarTreinador(t, equipe));
  const principais = treinadores.filter((t) => t.categoria !== 'posgame');
  const posgame = treinadores.filter((t) => t.categoria === 'posgame');
  const temEquipe = equipe.length > 0;

  let dificuldade = null;
  if (temEquipe) {
    const notaGeral = media(principais.map((t) => t.nota));
    const nivel = NIVEIS.find((n) => notaGeral >= n.minimo);
    dificuldade = { ...nivel, nota: notaGeral };
  }

  // Onde a sua equipe mais sofre (só quem está em desvantagem), do pior para o melhor
  const maisDificeis = principais
    .filter((t) => t.sentido === 'desvantagem')
    .sort((a, b) => a.nota - b.nota)
    .slice(0, 3);

  return { regiao: dados.regiao, temEquipe, treinadores, principais, posgame, dificuldade, maisDificeis };
}

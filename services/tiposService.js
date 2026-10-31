// services/tiposService.js
// Como a equipe lida com cada um dos 17 tipos, em dois medidores por tipo:
//
//  🛡️ DEFESA: cada Pokémon da equipe pontua contra o tipo atacante:
//       fraco 2x = -1 | fraco 4x = -2 | resiste 1/2 = +0,5 | resiste 1/4 = +1 | imune = +1
//     (uma resistência vale metade de uma fraqueza: o Pokémon fraco continua em risco).
//     A soma dá o saldo; cada quadrado equivale a 1 ponto (perto de zero = neutro).
//  ⚔️ ATAQUE: quantos Pokémon da equipe acertam o tipo em cheio (super efetivo),
//     usando os tipos do próprio Pokémon (não os golpes que ele sabe).
//     Verde = quantos acertam; sem cor = só dano normal; vermelho = só dano fraco ou nulo.
//
// Não depende da tela: recebe a equipe pronta (lista de { nome, tipos }).

import { multiplicador, LISTA_TIPOS } from '../data/tipos';

export const QUADRADOS_MAX = 5;
const PESO_RESISTENCIA = 0.5; // quanto uma resistência vale em relação a uma fraqueza
const MARGEM_NEUTRA = 0.5; // saldo abaixo disso (em módulo) = neutro

// Pontos de defesa de UM Pokémon contra um tipo atacante (negativo = fraco)
function pontosDefesa(tipoAtacante, pokemon) {
  const mult = multiplicador(tipoAtacante, pokemon.tipos);
  if (mult === 0) return 2 * PESO_RESISTENCIA; // imune conta como resistir 4x
  const nivel = -Math.log2(mult); // 2x -> -1 | 4x -> -2 | 1/2 -> +1 | 1/4 -> +2
  return nivel < 0 ? nivel : nivel * PESO_RESISTENCIA;
}

// Maior dano que os tipos de um Pokémon causam em um alvo de um tipo só
function melhorAtaque(pokemon, tipoAlvo) {
  return pokemon.tipos.reduce((maior, tipo) => Math.max(maior, multiplicador(tipo, [tipoAlvo])), 0);
}

function medidorDefesa(saldo) {
  const modulo = Math.abs(saldo);
  if (modulo < MARGEM_NEUTRA) return { sentido: 'neutro', quadrados: 0 };
  return {
    sentido: saldo > 0 ? 'vantagem' : 'desvantagem',
    quadrados: Math.min(QUADRADOS_MAX, Math.ceil(modulo)),
  };
}

function medidorAtaque(equipe, tipoAlvo) {
  const melhores = equipe.map((p) => melhorAtaque(p, tipoAlvo));
  const quantosAcertam = melhores.filter((m) => m > 1).length;
  if (quantosAcertam > 0) {
    return { sentido: 'vantagem', quadrados: Math.min(QUADRADOS_MAX, quantosAcertam) };
  }
  const melhor = Math.max(...melhores);
  if (melhor >= 1) return { sentido: 'neutro', quadrados: 0 };
  return { sentido: 'desvantagem', quadrados: melhor === 0 ? 3 : 1 }; // nulo (0x) pesa mais que fraco (1/2)
}

// Devolve null se a equipe estiver vazia.
export function analisarTipos(equipe) {
  if (equipe.length === 0) return null;

  const linhas = LISTA_TIPOS.map((tipo) => {
    const saldo = equipe.reduce((soma, p) => soma + pontosDefesa(tipo, p), 0);
    const danoRecebido = (p) => multiplicador(tipo, p.tipos);

    return {
      tipo,
      saldo,
      defesa: medidorDefesa(saldo),
      ataque: medidorAtaque(equipe, tipo),
      fracos: equipe.filter((p) => danoRecebido(p) > 1).map((p) => p.nome),
      resistem: equipe.filter((p) => danoRecebido(p) > 0 && danoRecebido(p) < 1).map((p) => p.nome),
      imunes: equipe.filter((p) => danoRecebido(p) === 0).map((p) => p.nome),
      atacamBem: equipe.filter((p) => melhorAtaque(p, tipo) > 1).map((p) => p.nome),
    };
  }).sort((a, b) => a.saldo - b.saldo || a.atacamBem.length - b.atacamBem.length); // pior defesa primeiro

  return {
    linhas,
    // Onde a defesa está em desvantagem (do pior para o melhor)
    pontosFracos: linhas.filter((l) => l.defesa.sentido === 'desvantagem').slice(0, 3),
    // Tipos que nenhum Pokémon seu acerta em cheio
    semCobertura: linhas.filter((l) => l.atacamBem.length === 0),
  };
}

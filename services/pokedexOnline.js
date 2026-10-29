// services/pokedexOnline.js
// Busca na PokéAPI a Pokédex regional dos jogos ONLINE (Diamond ... White 2)
// para saber quais Pokémon estão disponíveis em cada um.
// É 1 requisição por Pokédex. O resultado fica guardado em memória enquanto o
// app estiver aberto (o cache permanente entra junto com a persistência).

import { JOGOS } from '../data/jogos';

const API = 'https://pokeapi.co/api/v2';
const TEMPO_LIMITE_MS = 15000;

// Cache em memória: { 'original-sinnoh': Set([ids]) }
// Jogos que usam a mesma Pokédex (ex.: Diamond e Pearl) compartilham a lista.
const porPokedex = {};
// Requisições em andamento, para não pedir a mesma Pokédex duas vezes
const emAndamento = {};

export function dexOnlineCarregada(jogoId) {
  const jogo = JOGOS[jogoId];
  return Boolean(jogo && porPokedex[jogo.pokedexRegional]);
}

// Set com os ids disponíveis no jogo, ou null se ainda não foi carregado
export function obterDexOnline(jogoId) {
  const jogo = JOGOS[jogoId];
  return (jogo && porPokedex[jogo.pokedexRegional]) || null;
}

async function buscarPokedex(nome) {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);

  try {
    const resposta = await fetch(`${API}/pokedex/${nome}`, { signal: controle.signal });
    if (!resposta.ok) {
      throw new Error(`A API respondeu ${resposta.status}`);
    }
    const dados = await resposta.json();
    const ids = dados.pokemon_entries.map((entrada) =>
      Number(entrada.pokemon_species.url.split('/').filter(Boolean).pop())
    );
    porPokedex[nome] = new Set(ids);
    return porPokedex[nome];
  } finally {
    clearTimeout(timer);
  }
}

// Carrega (ou reaproveita) a Pokédex do jogo. Lança erro se a rede falhar.
export function carregarPokedexOnline(jogoId) {
  const jogo = JOGOS[jogoId];
  if (!jogo) return Promise.reject(new Error('Jogo inválido.'));

  const nome = jogo.pokedexRegional;
  if (porPokedex[nome]) return Promise.resolve(porPokedex[nome]);

  if (!emAndamento[nome]) {
    emAndamento[nome] = buscarPokedex(nome).finally(() => {
      delete emAndamento[nome];
    });
  }
  return emAndamento[nome];
}

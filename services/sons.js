// services/sons.js
// Toca os sons registrados em data/sons.js (biblioteca expo-audio).
//   tocarSom('botao')        toca o som; se não houver arquivo, não faz nada
//   precarregarSons()        carrega todos de antemão (o primeiro toque não atrasa)
//   tocarSomPokemon(pokemon) som do 1º tipo do Pokémon (data/sonsTipos.js); nomeSomTipo(pokemon) dá o nome
//   tocarSomVoltar()         'cancelar' ao voltar de tela; não toca se outro som acabou de tocar
//   ativarSons(false)        silencia tudo (atalho para a configuração "somAtivo")
// Um erro de áudio nunca derruba o app: o som é só um detalhe.

import { createAudioPlayer } from 'expo-audio';
import { SONS } from '../data/sons';
import { SONS_TIPOS } from '../data/sonsTipos';
import { obterConfiguracoes, definirConfiguracao } from './configuracoes';

// Sons do menu + um som por tipo (chave "tipo:fire")
const FONTES = { ...SONS };
Object.keys(SONS_TIPOS).forEach((tipo) => {
  FONTES[`tipo:${tipo}`] = SONS_TIPOS[tipo];
});

const players = {};
const JANELA_VOLTAR_MS = 500;
let ultimoToque = 0;

export function ativarSons(valor) {
  definirConfiguracao('somAtivo', valor);
}

function obterPlayer(nome) {
  const fonte = FONTES[nome];
  if (!fonte) return null;
  if (!players[nome]) players[nome] = createAudioPlayer(fonte);
  return players[nome];
}

export function precarregarSons() {
  Object.keys(FONTES).forEach((nome) => {
    try {
      obterPlayer(nome);
    } catch (erro) {
      // ignora: o som será tentado de novo no primeiro toque
    }
  });
}

export function tocarSom(nome) {
  if (!obterConfiguracoes().somAtivo) return;
  ultimoToque = Date.now();
  try {
    const player = obterPlayer(nome);
    if (!player) return;
    // O expo-audio não volta ao início sozinho quando o som termina
    player.seekTo(0);
    player.play();
  } catch (erro) {
    // ignora
  }
}

// Som de cancelar para a navegação de volta. Se um botão acabou de tocar o seu próprio som
// (ex.: "Adicionar ao time" confirma e já volta), não toca outro em cima.
export function tocarSomVoltar() {
  if (Date.now() - ultimoToque < JANELA_VOLTAR_MS) return;
  tocarSom('cancelar');
}

// Nome do som de um Pokémon: o do PRIMEIRO tipo dele (o segundo tipo não conta).
// Serve para a prop "som" do Botao; devolve null se o Pokémon não tiver tipo.
export function nomeSomTipo(pokemon) {
  const tipo = pokemon && pokemon.tipos && pokemon.tipos[0];
  return tipo ? `tipo:${tipo}` : null;
}

export function tocarSomPokemon(pokemon) {
  const nome = nomeSomTipo(pokemon);
  if (nome) tocarSom(nome);
}

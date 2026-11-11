// services/sons.js
// Toca os sons registrados em data/sons.js (biblioteca expo-audio).
//   tocarSom('botao')        toca o som; se não houver arquivo, não faz nada
//   precarregarSons()        carrega todos de antemão (o primeiro toque não atrasa)
//   ativarSons(false)        silencia tudo (atalho para a configuração "somAtivo")
// Um erro de áudio nunca derruba o app: o som é só um detalhe.

import { createAudioPlayer } from 'expo-audio';
import { SONS } from '../data/sons';
import { obterConfiguracoes, definirConfiguracao } from './configuracoes';

const players = {};

export function ativarSons(valor) {
  definirConfiguracao('somAtivo', valor);
}

function obterPlayer(nome) {
  const fonte = SONS[nome];
  if (!fonte) return null;
  if (!players[nome]) players[nome] = createAudioPlayer(fonte);
  return players[nome];
}

export function precarregarSons() {
  Object.keys(SONS).forEach((nome) => {
    try {
      obterPlayer(nome);
    } catch (erro) {
      // ignora: o som será tentado de novo no primeiro toque
    }
  });
}

export function tocarSom(nome) {
  if (!obterConfiguracoes().somAtivo) return;
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

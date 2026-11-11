// services/links.js
// Abrir páginas da web com checagem de internet.

import { Linking } from 'react-native';
import { semInternet } from './rede';

// Página do Pokémon na Bulbapedia (a wiki de Pokémon). Ex.: "Mr. Mime" -> Mr._Mime_(Pokémon)
export function urlWiki(nomePokemon) {
  const titulo = nomePokemon.replace(/ /g, '_');
  return encodeURI(`https://bulbapedia.bulbagarden.net/wiki/${titulo}_(Pokémon)`);
}

// Retorna { ok: true } ou { ok: false, motivo: '...' }
export async function abrirLink(url) {
  try {
    // semInternet() considera o modo offline simulado e a conexão de verdade
    if (await semInternet()) {
      return { ok: false, motivo: 'Sem internet. Conecte-se para ver mais detalhes.' };
    }
    await Linking.openURL(url);
    return { ok: true };
  } catch (erro) {
    return { ok: false, motivo: 'Não foi possível abrir o site.' };
  }
}

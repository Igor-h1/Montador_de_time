// services/armazenamento.js
// Ler e gravar dados no aparelho (AsyncStorage). Um erro de armazenamento nunca derruba o app.
//   lerJSON(chave)          -> { erro, valor }
//                              erro: true só se NÃO foi possível ler (aí não se deve sobrescrever)
//                              valor: o dado salvo, ou null se não existe ou está corrompido
//   salvarJSON(chave, v)    -> true se gravou, false se falhou

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function lerJSON(chave) {
  let texto;
  try {
    texto = await AsyncStorage.getItem(chave);
  } catch (erro) {
    return { erro: true, valor: null };
  }
  if (texto === null || texto === undefined) return { erro: false, valor: null };
  try {
    return { erro: false, valor: JSON.parse(texto) };
  } catch (erro) {
    return { erro: false, valor: null }; // dado corrompido: é como se não existisse
  }
}

export async function salvarJSON(chave, valor) {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch (erro) {
    return false;
  }
}

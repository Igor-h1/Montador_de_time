// services/persistenciaEquipe.js
// Como as equipes são guardadas no aparelho e como o que foi guardado é conferido ao ler.
// Formato salvo: { firered: [6, 94], emerald: [], ..., livre: [] } (só os ids dos Pokémon).

export const CHAVE_EQUIPES = 'equipes_v1';

// Aceita só o que ainda faz sentido: equipes de jogos que existem, ids inteiros de Pokémon
// que existem, sem repetição e até "max" por equipe. O resto (dado antigo, corrompido ou de
// um jogo removido) é descartado, em vez de quebrar o app.
//   salvo      o que veio do armazenamento (qualquer coisa)
//   chaves     ids de equipe válidos (os jogos e o ambiente livre)
//   existe     função: id -> true se o Pokémon existe
export function validarEquipes(salvo, chaves, existe, max) {
  const resultado = {};
  chaves.forEach((chave) => {
    const lista = salvo && Array.isArray(salvo[chave]) ? salvo[chave] : [];
    const ids = [];
    lista.forEach((bruto) => {
      const id = Number(bruto);
      if (Number.isInteger(id) && existe(id) && !ids.includes(id)) ids.push(id);
    });
    resultado[chave] = ids.slice(0, max);
  });
  return resultado;
}

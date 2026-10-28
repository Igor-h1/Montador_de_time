// context/EquipeContext.js
// Estado global da equipe, separado por jogo: { firered: [6, 94], emerald: [] }
// Guarda só os IDs dos Pokémon (leve e fácil de salvar na Etapa 7).
//
// Uso nas telas:
//   const { adicionar, remover, pokemonsDaEquipe } = useEquipe();
//   const resultado = adicionar(6, 'firered');  // { ok: true } ou { ok: false, motivo }

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { JOGOS } from '../data/jogos';
import { buscarPorId, estaDisponivel } from '../services/pokemonService';

export const MAX_EQUIPE = 6;

const EquipeContext = createContext(null);

// Gera { firered: [], emerald: [] } a partir de data/jogos.js
function criarEquipeVazia() {
  const vazia = {};
  Object.keys(JOGOS).forEach((jogoId) => {
    vazia[jogoId] = [];
  });
  return vazia;
}

export function EquipeProvider({ children }) {
  const [equipe, setEquipe] = useState(criarEquipeVazia);

  // Valida e adiciona. Retorna { ok: true } ou { ok: false, motivo: '...' }
  const adicionar = useCallback(
    (idPokemon, jogoId) => {
      const lista = equipe[jogoId];
      if (!lista) return { ok: false, motivo: 'Jogo inválido.' };

      const pokemon = buscarPorId(idPokemon);
      if (!pokemon) return { ok: false, motivo: 'Pokémon não encontrado.' };

      if (!estaDisponivel(pokemon.id, jogoId)) {
        return { ok: false, motivo: 'Esse Pokémon não está disponível neste jogo.' };
      }
      if (lista.includes(pokemon.id)) {
        return { ok: false, motivo: 'Esse Pokémon já está na equipe.' };
      }
      if (lista.length >= MAX_EQUIPE) {
        return { ok: false, motivo: `A equipe já tem ${MAX_EQUIPE} Pokémon.` };
      }

      // Atualização imutável: cria uma nova lista, sem alterar a anterior
      setEquipe({ ...equipe, [jogoId]: [...lista, pokemon.id] });
      return { ok: true };
    },
    [equipe]
  );

  const remover = useCallback((idPokemon, jogoId) => {
    setEquipe((atual) => ({
      ...atual,
      [jogoId]: (atual[jogoId] || []).filter((id) => id !== idPokemon),
    }));
  }, []);

  // Converte os ids guardados nos objetos completos dos Pokémon
  const pokemonsDaEquipe = useCallback(
    (jogoId) => (equipe[jogoId] || []).map((id) => buscarPorId(id)).filter(Boolean),
    [equipe]
  );

  const valor = useMemo(
    () => ({ equipe, adicionar, remover, pokemonsDaEquipe, MAX_EQUIPE }),
    [equipe, adicionar, remover, pokemonsDaEquipe]
  );

  return <EquipeContext.Provider value={valor}>{children}</EquipeContext.Provider>;
}

export function useEquipe() {
  const contexto = useContext(EquipeContext);
  if (!contexto) {
    throw new Error('useEquipe precisa ser usado dentro de <EquipeProvider>');
  }
  return contexto;
}

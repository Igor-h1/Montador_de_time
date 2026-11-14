// context/EquipeContext.js
// Estado global da equipe, separado por jogo: { firered: [6, 94], emerald: [], ... }
// Guarda só os IDs dos Pokémon. A equipe é salva no aparelho (AsyncStorage) a cada mudança
// e lida ao abrir o app: o App.js espera por "carregado" antes de mostrar as telas.
//
// Uso nas telas:
//   const { adicionar, remover, pokemonsDaEquipe } = useEquipe();
//   const resultado = adicionar(6, 'firered');  // { ok: true } ou { ok: false, motivo }
//   limparTodas();                               // esvazia as equipes de todos os jogos e a livre
//   adicionar(6, 'firered', { shiny: true });    // salva o Pokémon como shiny
//   ehShiny(6, 'firered');  definirShiny(6, 'firered', false);

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { JOGOS } from '../data/jogos';
import { ID_LIVRE } from '../data/livre';
import { buscarPorId, estaDisponivel } from '../services/pokemonService';
import { lerJSON, salvarJSON } from '../services/armazenamento';
import { CHAVE_EQUIPES, CHAVE_SHINIES, validarEquipes, validarShinies } from '../services/persistenciaEquipe';

export const MAX_EQUIPE = 6;

const EquipeContext = createContext(null);

// Gera { firered: [], emerald: [], ..., livre: [] } a partir de data/jogos.js
function criarEquipeVazia() {
  const vazia = {};
  Object.keys(JOGOS).forEach((jogoId) => {
    vazia[jogoId] = [];
  });
  vazia[ID_LIVRE] = []; // equipe do ambiente livre
  return vazia;
}

export function EquipeProvider({ children }) {
  const [equipe, setEquipe] = useState(criarEquipeVazia);
  // Quais Pokémon da equipe foram salvos como shiny: { firered: [6], ... } (mesmo formato da equipe)
  const [shinies, setShinies] = useState(criarEquipeVazia);
  const [carregado, setCarregado] = useState(false);
  // Só grava depois de ler com sucesso: se a leitura falhar, não sobrescreve o que está salvo
  const podeSalvar = useRef(false);

  // Ao abrir o app: lê as equipes e os shinies salvos (e descarta o que não faz mais sentido)
  useEffect(() => {
    let cancelado = false;
    Promise.all([lerJSON(CHAVE_EQUIPES), lerJSON(CHAVE_SHINIES)]).then(([lidoEquipes, lidoShinies]) => {
      if (cancelado) return;
      if (!lidoEquipes.erro && !lidoShinies.erro) {
        podeSalvar.current = true;
        const chaves = Object.keys(criarEquipeVazia());
        const equipeSalva = validarEquipes(
          lidoEquipes.valor,
          chaves,
          (id) => Boolean(buscarPorId(id)),
          MAX_EQUIPE
        );
        setEquipe(equipeSalva);
        setShinies(validarShinies(lidoShinies.valor, equipeSalva, chaves));
      }
      setCarregado(true);
    });
    return () => {
      cancelado = true;
    };
  }, []);

  // A cada mudança: salva no aparelho
  useEffect(() => {
    if (carregado && podeSalvar.current) {
      salvarJSON(CHAVE_EQUIPES, equipe);
      salvarJSON(CHAVE_SHINIES, shinies);
    }
  }, [equipe, shinies, carregado]);

  // Valida e adiciona. Retorna { ok: true } ou { ok: false, motivo: '...' }
  // opcoes.shiny = true salva o Pokémon como shiny (ele aparece shiny na equipe)
  const adicionar = useCallback(
    (idPokemon, jogoId, opcoes = {}) => {
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
      if (opcoes.shiny) {
        setShinies((atual) => ({ ...atual, [jogoId]: [...(atual[jogoId] || []), pokemon.id] }));
      }
      return { ok: true };
    },
    [equipe]
  );

  const remover = useCallback((idPokemon, jogoId) => {
    setEquipe((atual) => ({
      ...atual,
      [jogoId]: (atual[jogoId] || []).filter((id) => id !== idPokemon),
    }));
    setShinies((atual) => ({
      ...atual,
      [jogoId]: (atual[jogoId] || []).filter((id) => id !== idPokemon),
    }));
  }, []);

  // Liga ou desliga o shiny de um Pokémon que já está na equipe
  const definirShiny = useCallback((idPokemon, jogoId, valor) => {
    setShinies((atual) => {
      const sem = (atual[jogoId] || []).filter((id) => id !== idPokemon);
      return { ...atual, [jogoId]: valor ? [...sem, idPokemon] : sem };
    });
  }, []);

  const ehShiny = useCallback(
    (idPokemon, jogoId) => (shinies[jogoId] || []).includes(idPokemon),
    [shinies]
  );

  // Esvazia todas as equipes de uma vez (todos os jogos e o ambiente livre)
  const limparTodas = useCallback(() => {
    setEquipe(criarEquipeVazia());
    setShinies(criarEquipeVazia());
  }, []);

  // Converte os ids guardados nos objetos completos dos Pokémon
  const pokemonsDaEquipe = useCallback(
    (jogoId) => (equipe[jogoId] || []).map((id) => buscarPorId(id)).filter(Boolean),
    [equipe]
  );

  const valor = useMemo(
    () => ({
      equipe,
      adicionar,
      remover,
      limparTodas,
      pokemonsDaEquipe,
      ehShiny,
      definirShiny,
      carregado,
      MAX_EQUIPE,
    }),
    [equipe, adicionar, remover, limparTodas, pokemonsDaEquipe, ehShiny, definirShiny, carregado]
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

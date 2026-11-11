// services/tema.js
// Tema (claro/escuro) do app. O modo escuro é ligado em Configurações (modoEscuro).
//   <TemaProvider>         envolve o app (em App.js) e entrega o tema atual
//   useTema()              { nome, escuro, COR, APARELHO } do tema atual
//   useEstilos(criar)      estilos da tela: criar = (COR, APARELHO) => StyleSheet.create({...}).
//                          O resultado é guardado por tema, então não é recalculado a cada render.
// Quando o tema muda, todo componente que usa o hook é redesenhado sozinho.

import { createContext, createElement, useContext } from 'react';
import { TEMA_CLARO, TEMA_ESCURO } from '../data/tema';
import { useConfiguracoes } from './configuracoes';

const TemaContext = createContext(TEMA_CLARO);

export function TemaProvider({ children }) {
  const { modoEscuro } = useConfiguracoes();
  return createElement(
    TemaContext.Provider,
    { value: modoEscuro ? TEMA_ESCURO : TEMA_CLARO },
    children
  );
}

export function useTema() {
  return useContext(TemaContext);
}

// criar -> { tema, estilos } do último tema usado
const GUARDADO = new Map();

export function useEstilos(criar) {
  const tema = useTema();
  const antigo = GUARDADO.get(criar);
  if (antigo && antigo.tema === tema) return antigo.estilos;

  const estilos = criar(tema.COR, tema.APARELHO);
  GUARDADO.set(criar, { tema, estilos });
  return estilos;
}

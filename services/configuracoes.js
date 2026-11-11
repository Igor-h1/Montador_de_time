// services/configuracoes.js
// Configurações do app, guardadas só em memória (voltam ao padrão ao fechar o app;
// a persistência entra numa etapa futura).
//   somAtivo      true  = os sons tocam
//   modoOffline   false = usa a internet de verdade; true = SIMULA estar sem internet
// Uso:
//   const { somAtivo, modoOffline } = useConfiguracoes();   // em componentes (re-renderiza)
//   obterConfiguracoes().modoOffline                         // fora de componentes
//   definirConfiguracao('modoOffline', true);

import { useState, useEffect } from 'react';

// O objeto é sempre SUBSTITUÍDO (nunca alterado), então quem guarda uma referência
// consegue perceber a mudança.
let estado = { somAtivo: true, modoOffline: false };
const ouvintes = new Set();

export function obterConfiguracoes() {
  return estado;
}

export function definirConfiguracao(chave, valor) {
  if (!(chave in estado)) return;
  const novo = Boolean(valor);
  if (estado[chave] === novo) return;
  estado = { ...estado, [chave]: novo };
  ouvintes.forEach((ouvinte) => ouvinte(estado));
}

// Avisa quando algo muda. Devolve a função que cancela o aviso.
export function assinarConfiguracoes(ouvinte) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

export function useConfiguracoes() {
  const [config, setConfig] = useState(estado);

  useEffect(() => {
    setConfig(estado); // pega uma mudança que tenha acontecido antes de assinar
    return assinarConfiguracoes(setConfig);
  }, []);

  return config;
}

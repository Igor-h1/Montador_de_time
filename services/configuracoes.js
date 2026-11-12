// services/configuracoes.js
// Configurações do app.
//   somAtivo      true  = os sons tocam                                   (salvo no aparelho)
//   modoEscuro    false = tema claro; true = tema escuro (services/tema.js) (salvo no aparelho)
//   modoOffline   false = usa a internet de verdade; true = SIMULA estar sem internet
//                 (NÃO é salvo: volta a desligado quando o app abre, para ninguém ficar "preso" nele)
// carregarConfiguracoes() lê o que foi salvo; o App.js espera por ela antes de mostrar as telas.
// Uso:
//   const { somAtivo, modoOffline } = useConfiguracoes();   // em componentes (re-renderiza)
//   obterConfiguracoes().modoOffline                         // fora de componentes
//   definirConfiguracao('modoOffline', true);

import { useState, useEffect } from 'react';
import { lerJSON, salvarJSON } from './armazenamento';

// O objeto é sempre SUBSTITUÍDO (nunca alterado), então quem guarda uma referência
// consegue perceber a mudança.
let estado = { somAtivo: true, modoOffline: false, modoEscuro: false };
const ouvintes = new Set();

const CHAVE = 'configuracoes_v1';
const SALVAS = ['somAtivo', 'modoEscuro'];

function salvar() {
  const dados = {};
  SALVAS.forEach((chave) => {
    dados[chave] = estado[chave];
  });
  salvarJSON(CHAVE, dados);
}

// Lê as configurações salvas (sem erro, mesmo se não houver nada ou se a leitura falhar)
export async function carregarConfiguracoes() {
  const { valor } = await lerJSON(CHAVE);
  if (!valor || typeof valor !== 'object') return;

  const novo = { ...estado };
  SALVAS.forEach((chave) => {
    if (typeof valor[chave] === 'boolean') novo[chave] = valor[chave];
  });
  estado = novo;
  ouvintes.forEach((ouvinte) => ouvinte(estado));
}

export function obterConfiguracoes() {
  return estado;
}

export function definirConfiguracao(chave, valor) {
  if (!(chave in estado)) return;
  const novo = Boolean(valor);
  if (estado[chave] === novo) return;
  estado = { ...estado, [chave]: novo };
  ouvintes.forEach((ouvinte) => ouvinte(estado));
  if (SALVAS.includes(chave)) salvar();
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

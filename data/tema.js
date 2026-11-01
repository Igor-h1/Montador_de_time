// data/tema.js
// Cores do app, inspiradas na Pokédex: base branca, vermelho como destaque,
// azul da "lente" e as três luzinhas (vermelha, amarela e verde).

export const COR = {
  vermelho: '#D0403A', // vermelho principal (mais suave que o da Pokédex clássica)
  vermelhoClaro: '#FBEAE8',
  azul: '#28AAFD',
  amarelo: '#FFCB05',
  verde: '#3DCD3D',

  fundo: '#FFFFFF', // cor principal das telas
  superficie: '#F5F6F8', // cartões e campos sobre o fundo branco
  borda: '#E5E7EB',
  texto: '#1F2937',
  textoSuave: '#6B7280',
  branco: '#FFFFFF',
};

// Sombra leve para cartões
export const SOMBRA = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 3,
};

// Paleta do aparelho em forma de Pokédex (tela de menu)
export const APARELHO = {
  corpo: COR.vermelho,
  corpoClaro: '#DC5A53',
  borda: '#8E2A26',
  lente: '#6FD0F5',
  telaBorda: '#3A3F45',
  painel: '#565B62',
  painelBorda: '#2B2F34',
  faixaVerde: '#92C84A',
  lcd: '#A9D45C',
  lcdBorda: '#4F6B25',
  lcdTexto: '#1E3310',
  direcional: '#2F3338',
  seta: '#9097A0',
  cancelar: '#E0554D',
  confirmar: '#3FAE4F',
};

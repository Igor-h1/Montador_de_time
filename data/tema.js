// data/tema.js
// Cores do app em dois temas: CLARO (padrão) e ESCURO (ativado em Configurações).
// Base branca, vermelho como destaque, azul da "lente" e as três luzinhas da Pokédex.
// As telas NÃO importam COR direto: usam o hook useTema() (services/tema.js), que entrega
// a paleta do tema ligado no momento. COR e APARELHO exportados aqui são só a versão clara.

const CLARO = {
  vermelho: '#D0403A', // vermelho principal (mais suave que o da Pokédex clássica)
  vermelhoClaro: '#FBEAE8',
  azul: '#28AAFD',
  amarelo: '#FFCB05',
  verde: '#3DCD3D',

  fundo: '#FFFFFF', // cor principal das telas
  superficie: '#F5F6F8', // caixas e campos sobre o fundo
  cartao: '#FFFFFF', // cartões com borda (Pokémon, capas, botões)
  borda: '#E5E7EB',
  contorno: '#D1D5DB', // contornos de quadrados vazios, medidores e chaves
  texto: '#1F2937',
  textoSuave: '#6B7280',
  branco: '#FFFFFF', // branco de verdade (texto sobre vermelho etc.), igual nos dois temas

  cabecalho: '#D0403A', // barra de título
  fundoSprite: '#F5F6F8', // quadrado atrás dos sprites
  placaSprite: '#FFFFFF', // placa atrás do sprite solto no cartão (invisível no claro)

  erroFundo: '#F8D7DA',
  erroTexto: '#842029',
  okFundo: '#D1E7DD',
  okTexto: '#0F5132',
  avisoFundo: '#FFF4CC',
  avisoTexto: '#6B5200',
  vermelhoTexto: '#B3001B', // texto vermelho de desvantagem
  verdeTexto: '#1F7A35', // texto verde de vantagem
};

const ESCURO = {
  vermelho: '#D0403A',
  vermelhoClaro: '#3A1F1E',
  azul: '#28AAFD',
  amarelo: '#FFCB05',
  verde: '#3DCD3D',

  fundo: '#121417',
  superficie: '#1D2025',
  cartao: '#23272D',
  borda: '#32373F',
  contorno: '#4B5563',
  texto: '#E8EAED',
  textoSuave: '#9CA3AF',
  branco: '#FFFFFF',

  cabecalho: '#8F2B26',
  fundoSprite: '#E4E7EB', // sprites têm contorno escuro: ficam sobre um fundo claro
  placaSprite: '#E4E7EB',

  erroFundo: '#3B1F23',
  erroTexto: '#F2B8BE',
  okFundo: '#1C3328',
  okTexto: '#A8DDBE',
  avisoFundo: '#3A3320',
  avisoTexto: '#F0D98A',
  vermelhoTexto: '#FF7B72',
  verdeTexto: '#5BD17A',
};

// Paleta do aparelho em forma de Pokédex (tela de menu)
const APARELHO_CLARO = {
  corpo: CLARO.vermelho,
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

const APARELHO_ESCURO = {
  ...APARELHO_CLARO,
  corpo: '#8F2B26',
  corpoClaro: '#A63B35',
  borda: '#4A1512',
  lente: '#4A9DBF',
  painel: '#3F434A',
  painelBorda: '#1B1E22',
};

// Sombra leve para cartões (igual nos dois temas)
export const SOMBRA = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 3,
};

export const TEMA_CLARO = { nome: 'claro', escuro: false, COR: CLARO, APARELHO: APARELHO_CLARO };
export const TEMA_ESCURO = { nome: 'escuro', escuro: true, COR: ESCURO, APARELHO: APARELHO_ESCURO };

// Só a versão clara, para quem ainda importa direto (ex.: Cabecalho.js, que não é usado)
export const COR = CLARO;
export const APARELHO = APARELHO_CLARO;

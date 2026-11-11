// data/sons.js
// Sons do menu. Para usar um som: salve o arquivo em assets/sons/ e troque o null pela
// linha do require (descomente). Enquanto estiver null, aquele botão fica em silêncio.
//
//   botao      direcional (cima/baixo) e toque numa opção para selecioná-la
//   confirmar  ✓ e abrir uma opção
//   cancelar   botão ✕
//   erro       opção bloqueada (sem internet) ou que ainda não abre ("em breve")
//   shinyAtivar / shinyDesativar   botão ✨ Shiny ao ligar / desligar
//
// Formato recomendado: .mp3 (ou .wav / .ogg), curto (até 1 segundo), mono, até uns 50 KB.

export const SONS = {
  botao: require('../assets/sons/botao.wav'),
  confirmar: require('../assets/sons/confirmar.wav'),
  cancelar: require('../assets/sons/cancelar.wav'),
  erro: require('../assets/sons/erro.wav'),
  shinyAtivar: require('../assets/sons/shiny-ativar.wav'),
  shinyDesativar: require('../assets/sons/shiny-desativar.wav'),
};

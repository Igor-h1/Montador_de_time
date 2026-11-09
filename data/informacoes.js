// data/informacoes.js
// Textos da opção "Informações" do menu. Para mudar um texto, edite aqui.
// Cada seção tem blocos. Um bloco pode ter: titulo, paragrafos (lista de textos),
// itens (lista com marcadores) e links ({ rotulo, url, descricao }).

export const INFORMACOES = [
  {
    id: 'direitos',
    icone: '⚖️',
    titulo: 'Direitos autorais',
    resumo: 'De quem é o Pokémon e de onde vêm os dados e as imagens.',
    blocos: [
      {
        titulo: 'Aviso',
        paragrafos: [
          'Pokémon e os nomes dos personagens Pokémon são marcas registradas da Nintendo. © Nintendo / Creatures Inc. / GAME FREAK inc. Todos os direitos reservados aos seus respectivos titulares.',
          'Este aplicativo é um projeto educacional, feito por um fã e sem fins comerciais. Ele não é oficial: não tem ligação, patrocínio nem aprovação da Nintendo, da GAME FREAK, da Creatures Inc. nem da The Pokémon Company.',
          'Os nomes, os sprites (imagens dos Pokémon) e os ícones dos tipos pertencem aos seus titulares e são usados aqui apenas com finalidade educacional e informativa.',
        ],
      },
      {
        titulo: 'De onde vêm os dados',
        paragrafos: [
          'Os dados dos Pokémon (tipos, status, evoluções e listas dos jogos) e as imagens vêm da PokéAPI, uma API gratuita e de código aberto criada por Paul Hallett e colaboradores. O próprio site da PokéAPI informa que Pokémon e os nomes dos personagens são marcas registradas da Nintendo.',
          'Os sprites vêm do repositório PokeAPI/sprites, no GitHub.',
        ],
      },
      {
        titulo: 'Referências',
        links: [
          { rotulo: 'Nintendo', url: 'https://www.nintendo.com/', descricao: 'Titular da marca Pokémon' },
          { rotulo: 'The Pokémon Company', url: 'https://www.pokemon.com/', descricao: 'Site oficial da série' },
          { rotulo: 'PokéAPI', url: 'https://pokeapi.co/', descricao: 'API de dados usada no app' },
          { rotulo: 'PokeAPI/sprites', url: 'https://github.com/PokeAPI/sprites', descricao: 'Repositório dos sprites' },
          { rotulo: 'Bulbapedia', url: 'https://bulbapedia.bulbagarden.net/', descricao: 'Wiki dos Pokémon da Elite dos 4 ("Saiba mais")' },
          { rotulo: 'Pokémon Database', url: 'https://pokemondb.net/', descricao: 'Página de cada Pokémon ("Saiba mais")' },
          { rotulo: 'Serebii', url: 'https://www.serebii.net/', descricao: 'Consultado para conferir os times da Elite dos 4' },
        ],
      },
    ],
  },

  {
    id: 'projeto',
    icone: '🛠️',
    titulo: 'Informações do projeto',
    resumo: 'Como o app usa as APIs e o que funciona sem internet.',
    blocos: [
      {
        titulo: 'Em resumo',
        paragrafos: [
          'O app junta dados embutidos, que funcionam sem internet, com consultas pela internet, para não ficar pesado no celular.',
        ],
      },
      {
        titulo: 'Embutido no app (funciona sem internet)',
        itens: [
          'Tipos, status base, evoluções e nomes dos 649 Pokémon: lidos da PokéAPI uma única vez, por scripts do projeto, e guardados no app.',
          'Números das Pokédex e lista de Pokémon de FireRed, LeafGreen, Ruby, Sapphire e Emerald.',
          'Sprites desses cinco jogos e os ícones dos tipos (do Pokémon Diamond/Pearl).',
          'Os times da Elite dos 4 e dos campeões.',
        ],
      },
      {
        titulo: 'Pela internet, na hora',
        itens: [
          'Lista de Pokémon dos jogos online (de Diamond a White 2): o app consulta a PokéAPI quando você abre o jogo e guarda o resultado enquanto o app está aberto.',
          'Sprites da Pokédex geral, dos jogos online e a versão shiny: carregados do repositório de sprites da PokéAPI.',
          'Os botões "Saiba mais" abrem páginas externas (Pokémon Database e Bulbapedia) no navegador.',
        ],
      },
      {
        titulo: 'Calculado dentro do app',
        paragrafos: [
          'Fraquezas, resistências, vantagem contra a Elite dos 4 e dificuldade estimada são calculados pelo próprio app, só com base nos tipos. Eles não consideram nível, golpes, habilidades nem itens.',
        ],
      },
      {
        titulo: 'Sobre a Elite dos 4',
        paragrafos: [
          'A PokéAPI não tem os times da Elite dos 4. Eles foram montados a partir de um documento do projeto, com ajustes feitos em sites de referência (como Serebii e Bulbapedia).',
        ],
      },
      {
        titulo: 'Cuidados com a API',
        itens: [
          'A PokéAPI é gratuita e pede que os dados sejam guardados em vez de consultados toda hora. Por isso o app embute o que dá e faz poucas consultas em tempo real.',
          'Os status vêm da PokéAPI com os valores mais recentes: alguns Pokémon podem ter números um pouco diferentes dos jogos mais antigos.',
        ],
      },
      {
        titulo: 'Tecnologias',
        itens: [
          'React Native com Expo',
          'React Navigation (telas)',
          'NetInfo (detecta a internet)',
          'expo-audio (sons)',
        ],
      },
    ],
  },

  {
    id: 'contexto',
    icone: '🌍',
    titulo: 'Contexto do aplicativo',
    resumo: 'O universo Pokémon, por que o app existe e por que ele é útil.',
    blocos: [
      {
        titulo: 'O universo Pokémon',
        paragrafos: [
          'Pokémon é uma série criada por Satoshi Tajiri e pela GAME FREAK, publicada pela Nintendo. Os primeiros jogos saíram em 1996, no Japão.',
          'Nos jogos, você é um treinador que captura, treina e batalha com criaturas chamadas Pokémon, viajando por regiões como Kanto, Johto, Hoenn, Sinnoh e Unova.',
          'Cada Pokémon tem um ou dois tipos (como Fogo, Água e Planta). Os tipos decidem quem causa mais ou menos dano a quem, e isso é a base da estratégia.',
          'A jornada termina na Liga Pokémon, onde estão a Elite dos 4 e o campeão da região. Para chegar lá, o treinador leva uma equipe de até 6 Pokémon.',
          'Cada jogo tem a sua própria Pokédex regional, e nem todo Pokémon aparece em todos os jogos.',
        ],
      },
      {
        titulo: 'Por que o app existe',
        paragrafos: [
          'Montar uma boa equipe exige conhecer os tipos, as fraquezas e quais Pokémon existem em cada jogo. Essa informação costuma estar espalhada por vários sites e é difícil de comparar.',
          'O app reúne tudo em um só lugar: você escolhe o jogo, monta a equipe e vê como ela se sai contra a Elite dos 4.',
          'Ele também é um projeto educacional de desenvolvimento de aplicativos com React Native.',
        ],
      },
      {
        titulo: 'Por que ele é bom',
        itens: [
          'Mostra as fraquezas e resistências de cada Pokémon e da equipe inteira.',
          'Compara a equipe com a Elite dos 4 e os campeões e aponta onde ela mais sofre.',
          'Cada jogo tem a sua lista, os seus números de Pokédex e os seus sprites.',
          'Funciona sem internet nos jogos de Kanto e Hoenn (FireRed, LeafGreen, Ruby, Sapphire e Emerald).',
          'Tem um ambiente livre para testar qualquer combinação com os 649 Pokémon.',
          'É leve: guarda só o essencial e carrega as imagens da internet quando precisa.',
        ],
      },
      {
        titulo: 'Para quem é útil',
        paragrafos: [
          'Para quem joga ou só curte o universo Pokémon: dá para ganhar tempo, evitar escolhas ruins e entender como os tipos funcionam.',
        ],
      },
    ],
  },
];

// Procura uma seção pelo id (ou devolve null)
export function buscarInformacao(id) {
  return INFORMACOES.find((secao) => secao.id === id) || null;
}

# Poké Team

## Descrição

Aplicativo em **React Native + Expo** para **montar times Pokémon** e consultar os Pokémon das
**gerações 3 a 5** (14 jogos). Para cada equipe, o app mostra tipos, fraquezas, status e evoluções, e
**estima a dificuldade contra a Elite dos 4** de cada jogo. Os jogos de Kanto e Hoenn funcionam sem internet.

Projeto educacional, sem fins comerciais e **não oficial** (veja [Créditos](#créditos-e-direitos-autorais)).

## Aluno

- Nome: **Igor Henrique Marques de Oliveira**
- RGM: **42249759**

## Telas

O app tem 15 telas, todas declaradas em um único Stack no `App.js`.

| Tela (arquivo em `screens/`) | O que faz |
|---|---|
| Menu (`Menu.js`) | Tela inicial, em forma de aparelho Pokédex, com as 4 opções do app |
| Escolher jogo (`Home.js`) | Os 14 jogos separados por região, cada um com capa e contagem da equipe, e o cartão do Ambiente livre |
| Equipe (`Equipe.js`) | 6 quadrados da equipe do jogo, resumo de tipos e gráfico contra a Elite dos 4 com a dificuldade estimada |
| Pokédex (`Pokedex.js`) | Pokémon do jogo escolhido, com busca, filtro de tipos e "só disponíveis" |
| Detalhes (`Detalhes.js`) | Sprite do jogo, shiny, tipos, status base, evolução, fraquezas e adicionar/remover do time |
| Tipos (`Tipos.js`) | Como a equipe se defende e ataca contra cada um dos 17 tipos |
| Elite (`Elite.js`) | Time de cada treinador da Elite dos 4 e o confronto de cada Pokémon contra a equipe |
| Pokédex geral (`PokedexGeral.js`) | Consulta dos 649 Pokémon, com os mesmos filtros |
| Detalhes da Pokédex geral (`PokedexDetalhes.js`) | Detalhes de um Pokémon fora de um jogo específico |
| Ambiente livre (`EquipeLivre.js`) | Equipe à parte, com qualquer Pokémon, comparada com o campeão de cada região |
| Campeões (`EliteLivre.js`) | Time dos campeões de todas as regiões contra a equipe livre |
| Elite e pós-game (`EliteLivreCompleta.js`) | Elite dos 4 e pós-game de todas as regiões, jogo a jogo |
| Informações (`Informacoes.js`) | Lista de assuntos: direitos autorais, APIs e contexto do app |
| Texto de Informações (`InformacaoTexto.js`) | Mostra o assunto escolhido, com links para os sites de referência |
| Configurações (`Configuracoes.js`) | Som, modo escuro, modo offline (simulado) e resetar todos os times |

## Fonte de dados

- **API pública: [PokéAPI](https://pokeapi.co/)**, consultada com `fetch` em `services/pokedexOnline.js`, para saber quais Pokémon existem em cada jogo online (Diamond a White 2).
- **Sprites:** repositório [PokeAPI/sprites](https://github.com/PokeAPI/sprites), carregados por URL (os dos jogos de Kanto e Hoenn vêm embutidos no app).
- **Dados locais** (em `data/`): lista de Pokémon com tipos e status, evoluções, tabela de tipos, times da Elite dos 4, textos do app. A maior parte é gerada por scripts a partir da PokéAPI (veja [Scripts de dados](#scripts-de-dados-opcional)).
- **No aparelho (AsyncStorage):** as equipes, o som e o modo escuro.

## Onde estão os requisitos

- **Componentes (18 em `components/`):** `Card.js`, `CardPokedex.js`, `SlotEquipe.js`, `Botao.js`, `BadgeTipo.js`, `Medidor.js`, `GraficoElite.js`, `CartaoTreinador.js`, `StatusBase.js`, `Evolucao.js`, `BarraFiltros.js`, `AparelhoPokedex.js`, entre outros. Vários são reutilizados: `Card` forma a lista da Pokédex, e `Botao` e `BadgeTipo` aparecem em várias telas.
- **Props com callback:**
  - `Card` e `CardPokedex` recebem `onPress`;
  - `SlotEquipe` recebe `onPress` e `onRemover`;
  - `Evolucao` recebe `onAbrir`;
  - `CartaoTreinador` recebe `onWiki`;
  - `GraficoElite` recebe `onSaberMais`;
  - `BarraFiltros` recebe `onBusca`, `onTipos` e `onModoTipos`.
- **`useState`:**
  - `screens/Pokedex.js`: busca, filtros, "só disponíveis", lista pronta e erro;
  - `screens/Menu.js`: opção selecionada;
  - `components/Card.js`: erro da imagem;
  - `context/EquipeContext.js`: as equipes, atualizadas de forma imutável (spread de objeto e de array);
  - campo controlado na busca (`value` + `onChangeText`) em `components/BarraFiltros.js`.
- **`useEffect`:**
  - `screens/Pokedex.js`: carrega a lista do jogo online quando a tela abre;
  - `services/useRede.js`: escuta a conexão e cancela o listener ao sair da tela (cleanup);
  - `context/EquipeContext.js`: lê as equipes salvas ao abrir o app e as salva a cada mudança;
  - `screens/Menu.js`: carrega os sons e rola a lista até a opção selecionada;
  - `screens/Detalhes.js`: o shiny volta ao sprite normal quando a internet cai.
- **Navegação com parâmetros** (`createNativeStackNavigator`, `NavigationContainer` e Stack no `App.js`):
  - `Home.js` abre `Equipe` com `{ jogo }`;
  - `Equipe.js` e `Pokedex.js` abrem `Detalhes` com `{ pokemonId, jogo }`, lidos em `Detalhes.js` por `route.params`;
  - o título do cabeçalho é dinâmico: nome do jogo na `Equipe` e nome do Pokémon em `Detalhes` (opções no `App.js`).

## Vídeo de demonstração

`demo/demo.mp4` video de 30 segundos, mostrando tudo que o app faz.
`demo` versão no **Youtube** caso prefira: https://youtu.be/DYo8wkC_l10

## Como executar

Precisa do **Node 18 ou superior** (`node -v`) e do app **Expo Go** no celular, em uma versão compatível com o SDK
do projeto (**Expo SDK 58**, conforme o `package.json`).

```bash
npm install
npx expo start
```

Escaneie o QR code com o Expo Go. Se algo estranho aparecer depois de mudar arquivos, limpe o cache com
`npx expo start -c`.

## Funcionalidades

- **Montar time** em 14 jogos (FireRed, LeafGreen, Ruby, Sapphire, Emerald, Diamond, Pearl, Platinum,
  HeartGold, SoulSilver, Black, White, Black 2 e White 2), até 6 Pokémon por jogo.
- **Pokédex de cada jogo** com a numeração regional, indisponíveis bloqueados (🔒), busca por nome ou número e
  filtro por **vários tipos** ("qualquer um" ou "todos juntos").
- **Detalhes**: shiny, status base, evolução com o método, fraquezas e resistências, e link "Saiba mais".
- **Análise da equipe**: resumo de tipos, defesa e ataque contra cada tipo, e **dificuldade estimada**
  (Fácil, Média, Difícil, Muito difícil) contra a Elite dos 4 e o campeão.
- **Ambiente livre** e **Pokédex geral** com os 649 Pokémon.
- **Configurações**: som, **modo escuro**, **modo offline** (simula a falta de internet) e
  **resetar todos os times** de uma vez.
- **Sons**: menu, um som diferente para cada tipo (o do 1º tipo do Pokémon), shiny e voltar de tela.
- **Dados salvos no aparelho**: as equipes, o som e o modo escuro continuam ao fechar o app.

### Funciona sem internet?

| | Sem internet |
|---|---|
| FireRed, LeafGreen, Ruby, Sapphire e Emerald (dados e sprites embutidos) | ✅ funciona |
| Diamond, Pearl, Platinum, HeartGold, SoulSilver, Black, White, Black 2 e White 2 | ❌ a lista vem da PokéAPI |
| Ver Pokédex, Ambiente livre, shiny e links "Saiba mais" | ❌ precisam de internet |

Se a PokéAPI estiver fora do ar ao abrir um jogo online, o app pergunta se você quer **tentar novamente** ou
**ativar o modo offline**.

## Tecnologias

- React Native com Expo
- React Navigation (native stack)
- `@react-native-async-storage/async-storage` (salvar equipes e configurações)
- `@react-native-community/netinfo` (detectar a internet)
- `expo-audio` (sons)
- `react-native-safe-area-context`

## Estrutura

```
App.js                  navegação, providers (tema e equipe) e carregamento do que foi salvo
index.js                ponto de entrada
assets/                 capas, ícones do menu, sons, sprites dos jogos offline e ícones dos tipos
components/             componentes reutilizáveis (cartões, medidores, filtros, aparelho do menu ...)
context/                EquipeContext (equipes de cada jogo + ambiente livre, salvas no aparelho)
data/                   jogos, regiões, tipos, tema claro/escuro, Elite dos 4, textos de Informações
                        e os arquivos gerados pelos scripts (pokemons, evolucoes, spritesMap ...)
screens/                as telas do app
services/               regras e acesso a dados (PokéAPI, Elite, tipos, filtros, sons, tema, configurações ...)
scripts/                scripts do computador (NÃO fazem parte do app) que geram os dados embutidos
```

## Scripts de dados (opcional)

Os dados embutidos já vêm gerados. Os scripts só são necessários para **refazer** os arquivos. Rode da
**raiz** do projeto, com Node 18+ e internet:

| Script | O que faz |
|---|---|
| `node scripts/gerarDados.js` | gera `data/pokemons.js` (tipos, status e números regionais) |
| `node scripts/baixarSprites.js` | baixa os sprites dos jogos offline e gera `data/spritesMap.js` |
| `node scripts/baixarIconesTipos.js` | baixa os ícones dos tipos e gera `data/iconesTiposMap.js` |
| `node scripts/gerarEvolucoes.js` | gera `data/evolucoes.js` |
| `node scripts/verificarElite4.js` | confere `data/elite4.js` contra `data/pokemons.js` |

`gerarDados.js`, `baixarSprites.js` e `gerarEvolucoes.js` aceitam o argumento `teste` para rodar só com uma
amostra. As respostas da PokéAPI ficam em `scripts/cache/`, que não vai para o Git.

## Limitações

- A dificuldade contra a Elite dos 4 é uma **estimativa só pelos tipos**: não considera nível, golpes,
  habilidades nem itens.
- Os **status base** vêm da PokéAPI com os valores mais recentes; alguns Pokémon podem ter números um pouco
  diferentes dos jogos antigos. Os **tipos** seguem a tabela da geração 3 (sem o tipo Fairy).
- Os times da Elite dos 4 não existem na PokéAPI: foram montados a partir de um documento do projeto e
  conferidos em sites de referência (Serebii e Bulbapedia).
- Nomes de Pokémon, golpes e itens ficam em inglês; as pedras de evolução, em português.
- O **modo offline** só simula a falta de conexão dentro do app. Ele não é salvo e volta desligado ao abrir.

## Créditos e direitos autorais

Pokémon e os nomes dos personagens Pokémon são marcas registradas da **Nintendo**.
© Nintendo / Creatures Inc. / GAME FREAK inc. Este aplicativo é um projeto educacional feito por um fã,
**sem fins comerciais**, e **não tem ligação, patrocínio nem aprovação** da Nintendo, da GAME FREAK, da
Creatures Inc. nem da The Pokémon Company. Nomes, sprites, ícones dos tipos e capas pertencem aos seus titulares
e são usados só com finalidade educacional.

- Dados e sprites: [PokéAPI](https://pokeapi.co/) e [PokeAPI/sprites](https://github.com/PokeAPI/sprites)
- Páginas de consulta ("Saiba mais"): [Pokémon Database](https://pokemondb.net/) e [Bulbapedia](https://bulbapedia.bulbagarden.net/)
- Conferência dos times da Elite dos 4: [Serebii](https://www.serebii.net/)
- Sons dos tipos e do shiny: gerados por síntese para este projeto.

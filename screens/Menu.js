// screens/Menu.js
// Tela inicial: o aparelho em forma de Pokédex ocupa a tela inteira, com 4 opções
// na tela branca.
//  - Montar time: abre a escolha de jogo (rota 'MontarTime')
//  - Ver Pokédex: todos os Pokémon do app, só para consulta (precisa de internet)
//  - Informações: direitos autorais, como o app usa as APIs e o contexto do app
//  - Configurações: som, modo escuro e modo offline (simulado)
// A tela verde mostra a descrição da opção selecionada.
// Como usar: tocar numa opção a seleciona; tocar de novo (ou no ✓) abre.
// O direcional sobe e desce a seleção. Os sons ficam em data/sons.js.

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AparelhoPokedex from '../components/AparelhoPokedex';
import { useEstilos } from '../services/tema';
import { NOME_APP } from '../data/app';
import { ICONES_MENU } from '../data/iconesMenu';
import { precarregarSons, tocarSom } from '../services/sons';
import useRede from '../services/useRede';
import { useConfiguracoes } from '../services/configuracoes';

// emBreve: true = a opção ainda não abre nada (troque para false e informe a rota quando existir)
const OPCOES = [
  {
    id: 'montar',
    icone: '👥',
    nome: 'Montar time',
    descricao: 'Escolha o jogo e monte sua equipe.',
    rota: 'MontarTime',
  },
  {
    id: 'pokedex',
    icone: '📖',
    nome: 'Ver Pokédex',
    descricao: 'Veja todos os Pokémon. Precisa de internet.',
    precisaInternet: true,
    rota: 'PokedexGeral',
  },
  {
    id: 'info',
    icone: 'ℹ️',
    nome: 'Informações',
    descricao: 'Direitos autorais, APIs e o porquê do app.',
    rota: 'Informacoes',
  },
  {
    id: 'config',
    icone: '⚙️',
    nome: 'Configurações',
    descricao: 'Som, modo escuro e modo offline.',
    rota: 'Configuracoes',
  },
];

export default function Menu({ navigation }) {
  const styles = useEstilos(criarEstilos);
  const insets = useSafeAreaInsets();
  const online = useRede(); // true | false | null (ainda verificando)
  const { modoOffline } = useConfiguracoes();

  const [indice, setIndice] = useState(0);
  // Mensagem temporária na tela verde ({ titulo, texto }), por exemplo "SEM INTERNET"
  const [aviso, setAviso] = useState(null);

  // Carrega os sons de antemão, para o primeiro toque não atrasar
  useEffect(() => {
    precarregarSons();
  }, []);

  // Em telas pequenas as opções rolam; o direcional leva a rolagem até a opção selecionada
  const rolagem = useRef(null);
  const posicoes = useRef({});
  useEffect(() => {
    if (rolagem.current) {
      rolagem.current.scrollTo({ y: Math.max(0, (posicoes.current[indice] || 0) - 4), animated: true });
    }
  }, [indice]);

  const opcao = OPCOES[indice];
  const semInternet = Boolean(opcao.precisaInternet) && online === false;

  function selecionar(novoIndice) {
    setIndice(novoIndice);
    setAviso(null);
  }

  function mover(passo) {
    tocarSom('botao');
    selecionar((indice + passo + OPCOES.length) % OPCOES.length);
  }

  function abrir() {
    if (opcao.precisaInternet && online === false) {
      tocarSom('erro');
      setAviso({ titulo: 'SEM INTERNET', texto: 'Conecte-se para abrir a Pokédex.' });
      return;
    }
    if (opcao.emBreve) {
      tocarSom('erro');
      setAviso({ titulo: 'EM BREVE', texto: 'Esta opção chega nas próximas etapas.' });
      return;
    }
    tocarSom('confirmar');
    navigation.navigate(opcao.rota);
  }

  function cancelar() {
    tocarSom('cancelar');
    setAviso(null);
  }

  function aoTocarOpcao(i) {
    if (i === indice) {
      abrir(); // segundo toque na opção selecionada abre
    } else {
      tocarSom('botao');
      selecionar(i);
    }
  }

  // Texto da tela verde
  const lcdTitulo = aviso ? aviso.titulo : opcao.nome.toUpperCase();
  const lcdTexto = aviso
    ? aviso.texto
    : semInternet
    ? 'Sem internet. Conecte-se para abrir.'
    : opcao.descricao;

  return (
    // O fundo é o próprio vermelho do aparelho: não sobra nenhuma borda branca,
    // nem embaixo da barra de status e dos botões do Android.
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <AparelhoPokedex
        nome={NOME_APP}
        lcdTitulo={lcdTitulo}
        lcdTexto={lcdTexto}
        onCima={() => mover(-1)}
        onBaixo={() => mover(1)}
        onConfirmar={abrir}
        onCancelar={cancelar}
      >
        <Text style={styles.tituloTela}>{modoOffline ? 'MENU · MODO OFFLINE' : 'MENU'}</Text>

        <ScrollView ref={rolagem} showsVerticalScrollIndicator={false}>
        {OPCOES.map((o, i) => {
          const selecionada = i === indice;
          const bloqueada = Boolean(o.precisaInternet) && online === false;
          const imagem = ICONES_MENU[o.id];
          const etiqueta = bloqueada
            ? 'SEM INTERNET'
            : o.emBreve
            ? 'EM BREVE'
            : o.precisaInternet
            ? 'ONLINE'
            : null;

          return (
            <Pressable
              key={o.id}
              onLayout={(evento) => {
                posicoes.current[i] = evento.nativeEvent.layout.y;
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: selecionada, disabled: bloqueada }}
              onPress={() => aoTocarOpcao(i)}
              style={({ pressed }) => [
                styles.opcao,
                selecionada && styles.opcaoSelecionada,
                bloqueada && styles.opcaoBloqueada,
                pressed && styles.pressionado,
              ]}
            >
              {imagem ? (
                <Image source={imagem} style={styles.opcaoImagem} resizeMode="contain" />
              ) : (
                <Text style={styles.opcaoIcone}>{o.icone}</Text>
              )}
              <View style={styles.opcaoTextos}>
                <Text style={styles.opcaoNome}>{o.nome}</Text>
                {etiqueta ? <Text style={styles.opcaoEtiqueta}>{etiqueta}</Text> : null}
              </View>
              {selecionada ? <Text style={styles.marcador}>▶</Text> : null}
            </Pressable>
          );
        })}
        </ScrollView>
      </AparelhoPokedex>
    </View>
  );
}

const criarEstilos = (COR, APARELHO) => StyleSheet.create({
  container: { flex: 1, backgroundColor: APARELHO.corpo },

  tituloTela: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 3,
    color: COR.textoSuave,
    marginBottom: 10,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COR.superficie,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COR.borda,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  opcaoSelecionada: { borderColor: COR.vermelho, backgroundColor: COR.vermelhoClaro },
  opcaoBloqueada: { opacity: 0.5 },
  pressionado: { opacity: 0.8 },
  opcaoIcone: { fontSize: 26, width: 44, textAlign: 'center', marginRight: 12 },
  opcaoImagem: { width: 44, height: 44, marginRight: 12 },
  opcaoTextos: { flex: 1 },
  opcaoNome: { fontSize: 18, fontWeight: 'bold', color: COR.texto },
  opcaoEtiqueta: {
    alignSelf: 'flex-start',
    marginTop: 2,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: APARELHO.lente,
    color: COR.branco,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  marcador: { color: COR.vermelho, fontSize: 16, marginLeft: 8 },
});

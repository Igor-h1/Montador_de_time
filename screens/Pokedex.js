// screens/Pokedex.js
// Grade de Pokémon do jogo escolhido (jogo vem por route.params).
// Aberta a partir de um quadrado vazio da Equipe, para escolher um Pokémon.
// - Jogo online: primeiro carrega a lista do jogo na API (com carregando/erro)
// - Busca por nome ou número
// - Filtro por tipo (dá para escolher vários: "qualquer um" ou "todos juntos") e chave
//   "Só disponíveis" (ligada por padrão)
// - Toque em um Pokémon disponível -> Detalhes (pokemonId + jogo)

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, FlatList, Switch, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Card from '../components/Card';
import Botao from '../components/Botao';
import BarraFiltros from '../components/BarraFiltros';
import { JOGOS } from '../data/jogos';
import { COR } from '../data/tema';
import { listarPorJogo, obterSprite } from '../services/pokemonService';
import { carregarPokedexOnline, dexOnlineCarregada } from '../services/pokedexOnline';
import useRede from '../services/useRede';
import { semInternet } from '../services/rede';
import { useConfiguracoes, definirConfiguracao } from '../services/configuracoes';
import { passaFiltroTipos, MODO_QUALQUER } from '../services/filtros';

// Minúsculas e sem acentos, para a busca não depender de maiúsculas
function normalizar(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function Pokedex({ navigation, route }) {
  const jogoId = route.params.jogo;
  const jogo = JOGOS[jogoId];
  const online = useRede();
  const { modoOffline } = useConfiguracoes();
  const insets = useSafeAreaInsets(); // margem para os botões do Android

  const [busca, setBusca] = useState('');
  const [tiposFiltro, setTiposFiltro] = useState([]);
  const [modoTipos, setModoTipos] = useState(MODO_QUALQUER);
  const [apenasDisponiveis, setApenasDisponiveis] = useState(true); // já começa ligado

  // Jogos offline já têm a lista; os online precisam buscá-la na API
  const [dexPronta, setDexPronta] = useState(jogo.offline || dexOnlineCarregada(jogoId));
  const [erro, setErro] = useState(null);

  const carregarDex = useCallback(async () => {
    setErro(null);
    try {
      if (await semInternet()) {
        setErro('Sem internet. Conecte-se para carregar a lista deste jogo.');
        return;
      }
      await carregarPokedexOnline(jogoId);
      setDexPronta(true);
    } catch (e) {
      setErro('Não foi possível carregar a lista deste jogo. A PokéAPI pode estar fora do ar.');
    }
  }, [jogoId]);

  // Ao abrir um jogo online cuja lista ainda não foi carregada, busca na API
  useEffect(() => {
    if (!dexPronta) carregarDex();
  }, [dexPronta, carregarDex]);

  // Saída quando a API não responde: liga o modo offline e volta ao Menu, onde só
  // os jogos que funcionam sem internet continuam disponíveis
  function ativarModoOffline() {
    definirConfiguracao('modoOffline', true);
    navigation.popToTop();
  }

  // Os Pokémon do jogo (cada um com o campo "disponivel")
  const todos = useMemo(() => listarPorJogo(jogoId), [jogoId, dexPronta]);

  // Aplica busca + tipo + disponibilidade
  const lista = useMemo(() => {
    const termo = normalizar(busca.trim());
    const buscaNumerica = /^\d+$/.test(termo);

    return todos.filter((p) => {
      if (apenasDisponiveis && !p.disponivel) return false;
      if (!passaFiltroTipos(p, tiposFiltro, modoTipos)) return false;
      if (termo) {
        // número = o que aparece no Card (o da Pokédex do jogo; sem ele, o nacional)
        return buscaNumerica
          ? (p.numeroRegional || p.id) === Number(termo)
          : normalizar(p.nome).includes(termo);
      }
      return true;
    });
  }, [todos, busca, tiposFiltro, modoTipos, apenasDisponiveis]);

  // "Só disponíveis" é o padrão, então não conta como filtro ativo
  const temFiltro = busca !== '' || tiposFiltro.length > 0;

  function limparFiltros() {
    setBusca('');
    setTiposFiltro([]);
  }

  // useCallback mantém a mesma função entre renders; assim o React.memo
  // do Card funciona e a lista rola sem redesenhar tudo.
  const aoTocarCard = useCallback(
    (pokemon) => {
      navigation.navigate('Detalhes', { pokemonId: pokemon.id, jogo: jogoId });
    },
    [navigation, jogoId]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <Card
        pokemon={item}
        sprite={obterSprite(item.id, jogoId)}
        disponivel={item.disponivel}
        onPress={aoTocarCard}
        style={styles.card}
      />
    ),
    [jogoId, aoTocarCard]
  );

  // Jogo online ainda sem a lista: mostra carregando ou o erro
  if (!dexPronta) {
    return (
      <View style={styles.estado}>
        {erro ? (
          <>
            <Text style={styles.estadoTexto}>{erro}</Text>
            <Text style={styles.estadoPergunta}>O que você quer fazer?</Text>
            <View style={styles.acoes}>
              <Botao texto="Tentar novamente" onPress={carregarDex} />
              {!modoOffline ? (
                <Botao
                  texto="Ativar modo offline"
                  variante="secundaria"
                  onPress={ativarModoOffline}
                />
              ) : null}
            </View>
            {!modoOffline ? (
              <Text style={styles.estadoDica}>
                O modo offline deixa só FireRed, LeafGreen, Ruby, Sapphire e Emerald.
              </Text>
            ) : null}
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color={COR.vermelho} />
            <Text style={styles.estadoTexto}>Carregando a Pokédex do {jogo.nome}...</Text>
          </>
        )}
      </View>
    );
  }

  const semRede = !jogo.offline && online === false;

  return (
    <View style={styles.container}>
      {semRede ? (
        <Text style={styles.aviso}>📡 Sem internet: alguns sprites podem não aparecer.</Text>
      ) : null}

      <BarraFiltros
        busca={busca}
        onBusca={setBusca}
        tiposFiltro={tiposFiltro}
        onTipos={setTiposFiltro}
        modoTipos={modoTipos}
        onModoTipos={setModoTipos}
        contagem={`${lista.length} Pokémon`}
      >
        <View style={styles.alternar}>
          <Text style={styles.alternarTexto}>Só disponíveis</Text>
          <Switch
            value={apenasDisponiveis}
            onValueChange={setApenasDisponiveis}
            trackColor={{ false: '#D1D5DB', true: COR.vermelho }}
            thumbColor={COR.branco}
          />
        </View>
      </BarraFiltros>

      <FlatList
        data={lista}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.colunas}
        contentContainerStyle={[styles.lista, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioTexto}>Nenhum Pokémon encontrado</Text>
            {temFiltro ? (
              <Botao texto="Limpar filtros" variante="secundaria" onPress={limparFiltros} />
            ) : null}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COR.fundo },
  estado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COR.fundo,
  },
  estadoTexto: { color: COR.textoSuave, fontSize: 16, textAlign: 'center', marginVertical: 16 },
  estadoPergunta: { color: COR.texto, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  acoes: { alignSelf: 'stretch' },
  estadoDica: { color: COR.textoSuave, fontSize: 12, textAlign: 'center', marginTop: 8 },
  aviso: {
    backgroundColor: '#FFF4CC',
    color: '#6B5200',
    padding: 8,
    textAlign: 'center',
    fontSize: 13,
  },

  alternar: { flexDirection: 'row', alignItems: 'center' },
  alternarTexto: { fontSize: 13, color: COR.texto, fontWeight: '600', marginRight: 6 },

  // Lista
  lista: { paddingHorizontal: 12, paddingTop: 12, flexGrow: 1 },
  colunas: { justifyContent: 'space-between' },
  card: { width: '48.5%', marginBottom: 12 },
  vazio: { alignItems: 'center', paddingTop: 40 },
  vazioTexto: { color: COR.textoSuave, fontSize: 16, marginBottom: 16 },
});

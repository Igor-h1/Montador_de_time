// screens/Pokedex.js
// Grade de Pokémon do jogo escolhido (jogo vem por route.params).
// Aberta a partir de um quadrado vazio da Equipe, para escolher um Pokémon.
// - Jogo online: primeiro carrega a lista do jogo na API (com carregando/erro)
// - Busca por nome ou número
// - Filtro por tipo (chips) e chave "Só disponíveis" (ligada por padrão)
// - Toque em um Pokémon disponível -> Detalhes (pokemonId + jogo)

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  Pressable,
  Switch,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Card from '../components/Card';
import Botao from '../components/Botao';
import { JOGOS } from '../data/jogos';
import { TIPOS, LISTA_TIPOS } from '../data/tipos';
import { COR } from '../data/tema';
import { listarPorJogo, obterSprite } from '../services/pokemonService';
import { carregarPokedexOnline, dexOnlineCarregada } from '../services/pokedexOnline';
import useRede from '../services/useRede';

// Minúsculas e sem acentos, para a busca não depender de maiúsculas
function normalizar(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Etiqueta do filtro de tipo: ativa fica preenchida com a cor do tipo
function Chip({ texto, ativo, cor, onPress }) {
  const corAtiva = cor || COR.vermelho;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: ativo }}
      onPress={onPress}
      style={[styles.chip, ativo && { backgroundColor: corAtiva, borderColor: corAtiva }]}
    >
      <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>{texto}</Text>
    </Pressable>
  );
}

export default function Pokedex({ navigation, route }) {
  const jogoId = route.params.jogo;
  const jogo = JOGOS[jogoId];
  const online = useRede();
  const insets = useSafeAreaInsets(); // margem para os botões do Android

  const [busca, setBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState(null);
  const [apenasDisponiveis, setApenasDisponiveis] = useState(true); // já começa ligado

  // Jogos offline já têm a lista; os online precisam buscá-la na API
  const [dexPronta, setDexPronta] = useState(jogo.offline || dexOnlineCarregada(jogoId));
  const [erro, setErro] = useState(null);

  const carregarDex = useCallback(async () => {
    setErro(null);
    try {
      const rede = await NetInfo.fetch();
      if (rede.isConnected === false || rede.isInternetReachable === false) {
        setErro('Sem internet. Conecte-se para carregar a lista deste jogo.');
        return;
      }
      await carregarPokedexOnline(jogoId);
      setDexPronta(true);
    } catch (e) {
      setErro('Não foi possível carregar a lista deste jogo. Tente novamente.');
    }
  }, [jogoId]);

  // Ao abrir um jogo online cuja lista ainda não foi carregada, busca na API
  useEffect(() => {
    if (!dexPronta) carregarDex();
  }, [dexPronta, carregarDex]);

  // Os Pokémon do jogo (cada um com o campo "disponivel")
  const todos = useMemo(() => listarPorJogo(jogoId), [jogoId, dexPronta]);

  // Aplica busca + tipo + disponibilidade
  const lista = useMemo(() => {
    const termo = normalizar(busca.trim());
    const buscaNumerica = /^\d+$/.test(termo);

    return todos.filter((p) => {
      if (apenasDisponiveis && !p.disponivel) return false;
      if (tipoFiltro && !p.tipos.includes(tipoFiltro)) return false;
      if (termo) {
        // número = o que aparece no Card (o da Pokédex do jogo; sem ele, o nacional)
        return buscaNumerica
          ? (p.numeroRegional || p.id) === Number(termo)
          : normalizar(p.nome).includes(termo);
      }
      return true;
    });
  }, [todos, busca, tipoFiltro, apenasDisponiveis]);

  // "Só disponíveis" é o padrão, então não conta como filtro ativo
  const temFiltro = busca !== '' || tipoFiltro !== null;

  function limparFiltros() {
    setBusca('');
    setTipoFiltro(null);
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
            <Botao texto="Tentar de novo" onPress={carregarDex} />
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

      <View style={styles.filtros}>
        {/* Campo de busca com lupa e botão de limpar */}
        <View style={styles.campoBusca}>
          <Text style={styles.lupa}>🔍</Text>
          <TextInput
            style={styles.busca}
            placeholder="Buscar por nome ou número"
            placeholderTextColor="#9CA3AF"
            value={busca}
            onChangeText={setBusca}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {busca !== '' ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Limpar busca"
              onPress={() => setBusca('')}
              hitSlop={10}
            >
              <Text style={styles.limparBusca}>✕</Text>
            </Pressable>
          ) : null}
        </View>

        {/* Tipos */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.chips}
        >
          <Chip
            texto="Todos"
            ativo={tipoFiltro === null}
            onPress={() => setTipoFiltro(null)}
          />
          {LISTA_TIPOS.map((tipo) => (
            <Chip
              key={tipo}
              texto={`${TIPOS[tipo].icone} ${TIPOS[tipo].nome}`}
              ativo={tipoFiltro === tipo}
              cor={TIPOS[tipo].cor}
              onPress={() => setTipoFiltro(tipoFiltro === tipo ? null : tipo)}
            />
          ))}
        </ScrollView>

        {/* Contagem e chave "Só disponíveis" */}
        <View style={styles.resumo}>
          <Text style={styles.contagem}>{lista.length} Pokémon</Text>
          <View style={styles.alternar}>
            <Text style={styles.alternarTexto}>Só disponíveis</Text>
            <Switch
              value={apenasDisponiveis}
              onValueChange={setApenasDisponiveis}
              trackColor={{ false: '#D1D5DB', true: COR.vermelho }}
              thumbColor={COR.branco}
            />
          </View>
        </View>
      </View>

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
  aviso: {
    backgroundColor: '#FFF4CC',
    color: '#6B5200',
    padding: 8,
    textAlign: 'center',
    fontSize: 13,
  },

  // Barra de filtros
  filtros: {
    backgroundColor: COR.branco,
    paddingTop: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COR.borda,
  },
  campoBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COR.superficie,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginHorizontal: 12,
    height: 46,
  },
  lupa: { fontSize: 16, marginRight: 8 },
  busca: { flex: 1, fontSize: 16, color: COR.texto, paddingVertical: 0 },
  limparBusca: { fontSize: 16, color: COR.textoSuave, paddingLeft: 8 },
  chips: { paddingHorizontal: 12, paddingVertical: 10 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COR.borda,
    backgroundColor: COR.branco,
    marginRight: 8,
  },
  chipTexto: { fontSize: 13, color: COR.texto, fontWeight: '600' },
  chipTextoAtivo: { color: COR.branco },
  resumo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  contagem: { fontSize: 13, color: COR.textoSuave, fontWeight: '600' },
  alternar: { flexDirection: 'row', alignItems: 'center' },
  alternarTexto: { fontSize: 13, color: COR.texto, fontWeight: '600', marginRight: 6 },

  // Lista
  lista: { paddingHorizontal: 12, paddingTop: 12, flexGrow: 1 },
  colunas: { justifyContent: 'space-between' },
  card: { width: '48.5%', marginBottom: 12 },
  vazio: { alignItems: 'center', paddingTop: 40 },
  vazioTexto: { color: COR.textoSuave, fontSize: 16, marginBottom: 16 },
});

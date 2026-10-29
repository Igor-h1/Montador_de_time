// screens/Pokedex.js
// Grade de Pokémon do jogo escolhido (jogo vem por route.params).
// - Busca por nome ou número
// - Filtro por tipo
// - "Só disponíveis" (os bloqueados ficam com cadeado e não abrem)
// - Toque em um Pokémon disponível -> Detalhes (pokemonId + jogo)

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import Card from '../components/Card';
import Botao from '../components/Botao';
import { JOGOS } from '../data/jogos';
import { TIPOS, LISTA_TIPOS } from '../data/tipos';
import { listarPorJogo, obterSprite } from '../services/pokemonService';

// Minúsculas e sem acentos, para a busca não depender de maiúsculas
function normalizar(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function Chip({ texto, ativo, cor, onPress }) {
  const corAtiva = cor || '#333';
  return (
    <Pressable
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

  const [busca, setBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState(null);
  const [apenasDisponiveis, setApenasDisponiveis] = useState(false);

  // Os 386 do jogo (cada um com o campo "disponivel")
  const todos = useMemo(() => listarPorJogo(jogoId), [jogoId]);

  // Aplica busca + tipo + disponibilidade
  const lista = useMemo(() => {
    const termo = normalizar(busca.trim());
    const buscaNumerica = /^\d+$/.test(termo);

    return todos.filter((p) => {
      if (apenasDisponiveis && !p.disponivel) return false;
      if (tipoFiltro && !p.tipos.includes(tipoFiltro)) return false;
      if (termo) {
        return buscaNumerica
          ? p.id === Number(termo)
          : normalizar(p.nome).includes(termo);
      }
      return true;
    });
  }, [todos, busca, tipoFiltro, apenasDisponiveis]);

  const temFiltro = busca !== '' || tipoFiltro !== null || apenasDisponiveis;

  function limparFiltros() {
    setBusca('');
    setTipoFiltro(null);
    setApenasDisponiveis(false);
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

  return (
    <View style={styles.container}>
      <View style={styles.filtros}>
        <TextInput
          style={styles.busca}
          placeholder="Buscar por nome ou número"
          placeholderTextColor="#999"
          value={busca}
          onChangeText={setBusca}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          clearButtonMode="while-editing"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.chips}
        >
          <Chip
            texto="🔓 Só disponíveis"
            ativo={apenasDisponiveis}
            cor={jogo.cor}
            onPress={() => setApenasDisponiveis(!apenasDisponiveis)}
          />
          <Chip
            texto="Todos os tipos"
            ativo={tipoFiltro === null}
            cor={jogo.cor}
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

        <Text style={styles.contagem}>
          {lista.length} de {todos.length} Pokémon
        </Text>
      </View>

      <FlatList
        data={lista}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.colunas}
        contentContainerStyle={styles.lista}
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
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  filtros: { paddingHorizontal: 12, paddingTop: 12 },
  busca: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  chips: { paddingVertical: 4 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginRight: 6,
  },
  chipTexto: { fontSize: 13, color: '#333', fontWeight: '600' },
  chipTextoAtivo: { color: '#fff' },
  contagem: { fontSize: 12, color: '#777', marginTop: 6, marginBottom: 4 },
  lista: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 24, flexGrow: 1 },
  colunas: { justifyContent: 'space-between' },
  card: { width: '48.5%', marginBottom: 12 },
  vazio: { alignItems: 'center', paddingTop: 40 },
  vazioTexto: { color: '#888', fontSize: 16, marginBottom: 16 },
});

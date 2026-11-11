// screens/PokedexGeral.js
// Pokédex geral (opção "Ver Pokédex" do menu): todos os 649 Pokémon do app, para
// consulta. Só é aberta com internet, porque os sprites vêm da web.
// - Busca por nome ou número nacional
// - Filtro por tipo (dá para escolher vários: "qualquer um" ou "todos juntos")
// - Toque em um Pokémon -> PokedexDetalhes (tipos, fraquezas e "Saiba mais")
// - Com route.params.escolher (vindo do ambiente livre), os detalhes mostram o botão de
//   adicionar à equipe

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CardPokedex from '../components/CardPokedex';
import BarraFiltros from '../components/BarraFiltros';
import Botao from '../components/Botao';
import { useEstilos } from '../services/tema';
import { listarTodos } from '../services/pokemonService';
import useRede from '../services/useRede';
import { passaFiltroTipos, MODO_QUALQUER } from '../services/filtros';

// Minúsculas e sem acentos, para a busca não depender de maiúsculas
function normalizar(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function PokedexGeral({ navigation, route }) {
  const styles = useEstilos(criarEstilos);
  const escolher = Boolean(route.params && route.params.escolher);
  const insets = useSafeAreaInsets(); // margem para os botões do Android
  const online = useRede();

  const [busca, setBusca] = useState('');
  const [tiposFiltro, setTiposFiltro] = useState([]);
  const [modoTipos, setModoTipos] = useState(MODO_QUALQUER);

  const todos = useMemo(() => listarTodos(), []);

  // Aplica busca + tipo
  const lista = useMemo(() => {
    const termo = normalizar(busca.trim());
    const buscaNumerica = /^\d+$/.test(termo);

    return todos.filter((p) => {
      if (!passaFiltroTipos(p, tiposFiltro, modoTipos)) return false;
      if (termo) {
        return buscaNumerica ? p.id === Number(termo) : normalizar(p.nome).includes(termo);
      }
      return true;
    });
  }, [todos, busca, tiposFiltro, modoTipos]);

  const temFiltro = busca !== '' || tiposFiltro.length > 0;

  function limparFiltros() {
    setBusca('');
    setTiposFiltro([]);
  }

  // useCallback mantém a mesma função entre renders; assim o React.memo
  // do card funciona e a lista rola sem redesenhar tudo.
  const aoTocarCard = useCallback(
    (pokemon) =>
      navigation.navigate('PokedexDetalhes', { pokemonId: pokemon.id, montando: escolher }),
    [navigation, escolher]
  );

  const renderItem = useCallback(
    ({ item }) => <CardPokedex pokemon={item} onPress={aoTocarCard} style={styles.card} />,
    [aoTocarCard, styles]
  );

  return (
    <View style={styles.container}>
      {online === false ? (
        <Text style={styles.aviso}>📡 Sem internet: os sprites podem não aparecer.</Text>
      ) : null}

      <BarraFiltros
        busca={busca}
        onBusca={setBusca}
        tiposFiltro={tiposFiltro}
        onTipos={setTiposFiltro}
        modoTipos={modoTipos}
        onModoTipos={setModoTipos}
        contagem={`${lista.length} Pokémon`}
      />

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

const criarEstilos = (COR) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COR.fundo },
  aviso: {
    backgroundColor: COR.avisoFundo,
    color: COR.avisoTexto,
    padding: 8,
    textAlign: 'center',
    fontSize: 13,
  },
  lista: { paddingHorizontal: 12, paddingTop: 12, flexGrow: 1 },
  colunas: { justifyContent: 'space-between' },
  card: { width: '48.5%', marginBottom: 12 },
  vazio: { alignItems: 'center', paddingTop: 40 },
  vazioTexto: { color: COR.textoSuave, fontSize: 16, marginBottom: 16 },
});

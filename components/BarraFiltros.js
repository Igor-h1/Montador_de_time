// components/BarraFiltros.js
// Barra de filtros das Pokédex: campo de busca (com lupa e botão de limpar), linha de
// tipos (dá para escolher VÁRIOS), seletor "Qualquer um / Todos juntos" (aparece quando há
// 2 ou mais tipos escolhidos) e uma linha de resumo (contagem, com espaço para algo à direita).
// Props:
//   busca, onBusca            texto da busca e função que o altera
//   tiposFiltro, onTipos      lista de tipos escolhidos e função que a altera
//   modoTipos, onModoTipos    'qualquer' | 'todos' (ver services/filtros.js) e função que o altera
//   contagem                  texto do resumo (ex.: "649 Pokémon")
//   children                  (opcional) conteúdo à direita do resumo

import React from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { TIPOS, LISTA_TIPOS } from '../data/tipos';
import { useTema, useEstilos } from '../services/tema';
import { alternarTipo, MODO_QUALQUER, MODO_TODOS } from '../services/filtros';

// Etiqueta do filtro de tipo: ativa fica preenchida com a cor do tipo
function Chip({ texto, ativo, cor, onPress }) {
  const { COR } = useTema();
  const styles = useEstilos(criarEstilos);
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

// Um dos dois lados do seletor de modo
function Opcao({ texto, ativa, onPress }) {
  const styles = useEstilos(criarEstilos);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: ativa }}
      onPress={onPress}
      style={[styles.opcao, ativa && styles.opcaoAtiva]}
    >
      <Text style={[styles.opcaoTexto, ativa && styles.opcaoTextoAtivo]}>{texto}</Text>
    </Pressable>
  );
}

export default function BarraFiltros({
  busca,
  onBusca,
  tiposFiltro,
  onTipos,
  modoTipos,
  onModoTipos,
  contagem,
  children,
}) {
  const styles = useEstilos(criarEstilos);
  const varios = tiposFiltro.length >= 2;

  return (
    <View style={styles.filtros}>
      <View style={styles.campoBusca}>
        <Text style={styles.lupa}>🔍</Text>
        <TextInput
          style={styles.busca}
          placeholder="Buscar por nome ou número"
          placeholderTextColor="#9CA3AF"
          value={busca}
          onChangeText={onBusca}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {busca !== '' ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Limpar busca"
            onPress={() => onBusca('')}
            hitSlop={10}
          >
            <Text style={styles.limparBusca}>✕</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.chips}
      >
        <Chip texto="Todos" ativo={tiposFiltro.length === 0} onPress={() => onTipos([])} />
        {LISTA_TIPOS.map((tipo) => (
          <Chip
            key={tipo}
            texto={`${TIPOS[tipo].icone} ${TIPOS[tipo].nome}`}
            ativo={tiposFiltro.includes(tipo)}
            cor={TIPOS[tipo].cor}
            onPress={() => onTipos(alternarTipo(tiposFiltro, tipo))}
          />
        ))}
      </ScrollView>

      {varios ? (
        <View style={styles.modo}>
          <Text style={styles.modoRotulo}>Pokémon com:</Text>
          <View style={styles.modoOpcoes}>
            <Opcao
              texto="Qualquer um"
              ativa={modoTipos === MODO_QUALQUER}
              onPress={() => onModoTipos(MODO_QUALQUER)}
            />
            <Opcao
              texto="Todos juntos"
              ativa={modoTipos === MODO_TODOS}
              onPress={() => onModoTipos(MODO_TODOS)}
            />
          </View>
          {modoTipos === MODO_TODOS && tiposFiltro.length > 2 ? (
            <Text style={styles.modoAviso}>Nenhum Pokémon tem mais de 2 tipos.</Text>
          ) : null}
        </View>
      ) : null}

      <View style={styles.resumo}>
        <Text style={styles.contagem}>{contagem}</Text>
        {children}
      </View>
    </View>
  );
}

const criarEstilos = (COR) => StyleSheet.create({
  filtros: {
    backgroundColor: COR.fundo,
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
    backgroundColor: COR.cartao,
    marginRight: 8,
  },
  chipTexto: { fontSize: 13, color: COR.texto, fontWeight: '600' },
  chipTextoAtivo: { color: COR.branco },

  modo: { paddingHorizontal: 14, paddingBottom: 8 },
  modoRotulo: { fontSize: 12, color: COR.textoSuave, fontWeight: '600', marginBottom: 6 },
  modoOpcoes: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: COR.superficie,
    borderRadius: 14,
    padding: 3,
  },
  opcao: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 11 },
  opcaoAtiva: { backgroundColor: COR.vermelho },
  opcaoTexto: { fontSize: 13, fontWeight: '600', color: COR.texto },
  opcaoTextoAtivo: { color: COR.branco },
  modoAviso: { fontSize: 11, color: COR.vermelhoTexto, marginTop: 6 },

  resumo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    minHeight: 24,
  },
  contagem: { fontSize: 13, color: COR.textoSuave, fontWeight: '600' },
});

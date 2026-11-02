// components/BarraFiltros.js
// Barra de filtros: campo de busca (com lupa e botão de limpar), linha de tipos e uma
// linha de resumo (contagem, com espaço para algo à direita).
// Props:
//   busca, onBusca        texto da busca e função que o altera
//   tipoFiltro, onTipo    tipo escolhido (ou null) e função que o altera
//   contagem              texto do resumo (ex.: "649 Pokémon")
//   children              (opcional) conteúdo à direita do resumo

import React from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { TIPOS, LISTA_TIPOS } from '../data/tipos';
import { COR } from '../data/tema';

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

export default function BarraFiltros({ busca, onBusca, tipoFiltro, onTipo, contagem, children }) {
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
        <Chip texto="Todos" ativo={tipoFiltro === null} onPress={() => onTipo(null)} />
        {LISTA_TIPOS.map((tipo) => (
          <Chip
            key={tipo}
            texto={`${TIPOS[tipo].icone} ${TIPOS[tipo].nome}`}
            ativo={tipoFiltro === tipo}
            cor={TIPOS[tipo].cor}
            onPress={() => onTipo(tipoFiltro === tipo ? null : tipo)}
          />
        ))}
      </ScrollView>

      <View style={styles.resumo}>
        <Text style={styles.contagem}>{contagem}</Text>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    minHeight: 24,
  },
  contagem: { fontSize: 13, color: COR.textoSuave, fontWeight: '600' },
});

// components/ListaFraquezas.js
// Mostra fraquezas, resistências e imunidades de um Pokémon, agrupadas.
// Props: tipos (array com 1 ou 2 tipos, ex.: ['fire', 'flying'])

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BadgeTipo from './BadgeTipo';
import { calcularFraquezas } from '../data/tipos';

const GRUPOS = [
  { chave: 'x4', titulo: 'Muito fraco (4×)' },
  { chave: 'x2', titulo: 'Fraco (2×)' },
  { chave: 'x05', titulo: 'Resiste (½×)' },
  { chave: 'x025', titulo: 'Resiste muito (¼×)' },
  { chave: 'imune', titulo: 'Imune (0×)' },
];

export default function ListaFraquezas({ tipos }) {
  // Só recalcula quando os tipos mudam
  const fraquezas = useMemo(() => calcularFraquezas(tipos), [tipos]);

  return (
    <View>
      {GRUPOS.map(({ chave, titulo }) => {
        const lista = fraquezas[chave];
        if (lista.length === 0) return null;

        return (
          <View key={chave} style={styles.grupo}>
            <Text style={styles.titulo}>{titulo}</Text>
            <View style={styles.linha}>
              {lista.map((tipo) => (
                <BadgeTipo key={tipo} tipo={tipo} />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: { marginBottom: 8 },
  titulo: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 4 },
  linha: { flexDirection: 'row', flexWrap: 'wrap' },
});

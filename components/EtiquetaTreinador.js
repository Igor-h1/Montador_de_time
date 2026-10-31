// components/EtiquetaTreinador.js
// Etiqueta de especialidade do treinador: o tipo colorido (ex.: Dark) ou, quando
// ele não tem um tipo (Equilibrado, local etc.), uma etiqueta cinza com o texto.
// Props: treinador = { tipo, rotulo }

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BadgeTipo from './BadgeTipo';

export default function EtiquetaTreinador({ treinador }) {
  if (treinador.tipo) {
    return (
      <View style={styles.alinhar}>
        <BadgeTipo tipo={treinador.tipo} pequeno />
      </View>
    );
  }
  return (
    <View style={[styles.alinhar, styles.pilula]}>
      <Text style={styles.texto} numberOfLines={1}>
        {treinador.rotulo}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alinhar: { alignSelf: 'flex-start' },
  pilula: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
  },
  texto: { fontSize: 10, fontWeight: '700', color: '#4B5563' },
});

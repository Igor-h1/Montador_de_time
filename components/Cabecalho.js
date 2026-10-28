// components/Cabecalho.js
// Cabeçalho estilizado com título e subtítulo.
// Props: titulo, subtitulo (opcional), cor (opcional, ex.: a cor do jogo)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Cabecalho({ titulo, subtitulo, cor = '#CC0000' }) {
  return (
    <View style={[styles.container, { backgroundColor: cor }]}>
      <Text style={styles.titulo}>{titulo}</Text>
      {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  titulo: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subtitulo: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4 },
});

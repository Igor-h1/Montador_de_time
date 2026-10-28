// components/BadgeTipo.js
// Etiqueta colorida com o emoji e o nome do tipo (Fire, Water...).
// Props: tipo (chave de data/tipos.js, ex.: 'fire'), pequeno (boolean)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TIPOS } from '../data/tipos';

export default function BadgeTipo({ tipo, pequeno = false }) {
  const info = TIPOS[tipo];
  if (!info) return null;

  return (
    <View
      style={[
        styles.badge,
        pequeno && styles.badgePequeno,
        { backgroundColor: info.cor },
      ]}
    >
      <Text style={[styles.texto, pequeno && styles.textoPequeno]}>
        {info.icone} {info.nome}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  badgePequeno: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  texto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  textoPequeno: { fontSize: 10 },
});

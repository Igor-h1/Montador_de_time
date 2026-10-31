// components/SeloNivel.js
// Selo colorido com o nível de dificuldade (Fácil, Média, Difícil, Muito difícil).
// Props: nivel = { chave, rotulo } (vem de analisarElite)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CORES = {
  facil: { fundo: '#DCF5E1', texto: '#12651F' },
  media: { fundo: '#FFF4CC', texto: '#6B5200' },
  dificil: { fundo: '#FFE3CC', texto: '#9A4A00' },
  'muito-dificil': { fundo: '#FBD5DB', texto: '#9B0A23' },
};

export default function SeloNivel({ nivel }) {
  const cor = CORES[nivel.chave] || CORES.media;
  return (
    <View style={[styles.selo, { backgroundColor: cor.fundo }]}>
      <Text style={[styles.texto, { color: cor.texto }]}>{nivel.rotulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  selo: { borderRadius: 14, paddingHorizontal: 12, paddingVertical: 5 },
  texto: { fontSize: 14, fontWeight: 'bold' },
});

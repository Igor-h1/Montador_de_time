import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COR } from '../data/tema';

export default function Cabecalho({ titulo, subtitulo }) {
  return (
    <View style={styles.container}>
      <View style={styles.luzes}>
        <View style={styles.luzPrincipal} />
        <View style={[styles.luz, { backgroundColor: COR.vermelho }]} />
        <View style={[styles.luz, { backgroundColor: COR.amarelo }]} />
        <View style={[styles.luz, { backgroundColor: COR.verde }]} />
      </View>
      <Text style={styles.titulo}>{titulo}</Text>
      {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COR.vermelho,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  luzes: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  luzPrincipal: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COR.azul,
    borderWidth: 4,
    borderColor: COR.branco,
    marginRight: 12,
  },
  luz: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  titulo: { color: COR.branco, fontSize: 30, fontWeight: 'bold' },
  subtitulo: { color: COR.branco, fontSize: 14, marginTop: 4, opacity: 0.9 },
});

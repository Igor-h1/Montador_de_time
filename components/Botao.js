// components/Botao.js
// Botão reutilizável.
// Props: texto, onPress, variante ('primaria' | 'secundaria' | 'perigo'),
//        desabilitado (boolean), cor (opcional: troca a cor da variante primária)

import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const VARIANTES = {
  primaria: { fundo: '#2563EB', texto: '#fff', borda: '#2563EB' },
  secundaria: { fundo: '#fff', texto: '#333', borda: '#bbb' },
  perigo: { fundo: '#DC2626', texto: '#fff', borda: '#DC2626' },
};

export default function Botao({
  texto,
  onPress,
  variante = 'primaria',
  desabilitado = false,
  cor,
}) {
  const estilo = VARIANTES[variante] || VARIANTES.primaria;
  const fundo = cor && variante === 'primaria' ? cor : estilo.fundo;
  const borda = cor && variante === 'primaria' ? cor : estilo.borda;

  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      style={({ pressed }) => [
        styles.botao,
        { backgroundColor: fundo, borderColor: borda },
        pressed && styles.pressionado,
        desabilitado && styles.desabilitado,
      ]}
    >
      <Text style={[styles.texto, { color: estilo.texto }]}>{texto}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  texto: { fontSize: 16, fontWeight: '700' },
  pressionado: { opacity: 0.75 },
  desabilitado: { opacity: 0.4 },
});

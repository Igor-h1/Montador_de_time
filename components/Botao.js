import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { COR } from '../data/tema';

export default function Botao({
  texto,
  onPress,
  variante = 'primaria',
  desabilitado = false,
}) {
  const estiloVariante = styles[variante] || styles.primaria;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={desabilitado}
      onPress={onPress}
      style={({ pressed }) => [
        styles.botao,
        estiloVariante,
        desabilitado && styles.desabilitado,
        pressed && !desabilitado && styles.pressionado,
      ]}
    >
      <Text style={[styles.texto, variante === 'secundaria' && styles.textoSecundario]}>
        {texto}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 6,
  },
  primaria: { backgroundColor: COR.vermelho },
  secundaria: { backgroundColor: COR.superficie, borderWidth: 1, borderColor: COR.borda },
  perigo: { backgroundColor: '#B3001B' },
  texto: { color: COR.branco, fontSize: 15, fontWeight: '700' },
  textoSecundario: { color: COR.texto },
  desabilitado: { opacity: 0.5 },
  pressionado: { opacity: 0.8 },
});

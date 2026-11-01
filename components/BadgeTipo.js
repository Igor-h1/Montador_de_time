// components/BadgeTipo.js
// Mostra um tipo com o ÍCONE ORIGINAL do Pokémon Diamond/Pearl (o rótulo "FIRE",
// "WATER"...), igual em todos os jogos. Se o ícone não existir ou falhar ao
// carregar, mostra a etiqueta colorida com emoji e nome.
// Props: tipo (chave de data/tipos.js, ex.: 'fire'), pequeno (boolean)

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { TIPOS } from '../data/tipos';
import { ICONES_TIPOS } from '../data/iconesTiposMap';

export default function BadgeTipo({ tipo, pequeno = false }) {
  const [erroIcone, setErroIcone] = useState(false);

  const info = TIPOS[tipo];
  if (!info) return null;

  const icone = erroIcone ? null : ICONES_TIPOS[tipo];

  if (icone) {
    return (
      <View style={[styles.iconeCaixa, pequeno && styles.iconeCaixaPequena]}>
        <Image
          source={icone}
          accessibilityLabel={info.nome}
          style={pequeno ? styles.iconePequeno : styles.icone}
          resizeMode="contain"
          onError={() => setErroIcone(true)}
        />
      </View>
    );
  }

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
  // Ícone original (a imagem já traz o nome e a cor do tipo)
  iconeCaixa: { marginRight: 6, marginBottom: 6 },
  iconeCaixaPequena: { marginRight: 4, marginBottom: 4 },
  icone: { width: 64, height: 28 },
  iconePequeno: { width: 48, height: 21 },

  // Reserva: etiqueta colorida com emoji
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

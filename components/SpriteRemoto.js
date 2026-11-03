// components/SpriteRemoto.js
// Imagem que tenta uma lista de fontes, uma de cada vez: se a primeira falhar, passa
// para a próxima; se todas falharem, mostra um "?".
// Props: fontes (lista de { uri }), style (largura e altura)

import React, { useState, useEffect } from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';

export default function SpriteRemoto({ fontes, style }) {
  const [indice, setIndice] = useState(0);

  // Identifica as fontes pelo conteúdo (e não pela lista), para quem passa uma lista nova a
  // cada render não fazer a imagem recomeçar. Se for outro Pokémon, volta à primeira fonte.
  const chave = fontes.map((f) => (typeof f === 'object' ? f.uri : String(f))).join('|');
  useEffect(() => {
    setIndice(0);
  }, [chave]);

  const fonte = fontes[indice];

  if (!fonte) {
    return (
      <View style={[styles.vazio, style]}>
        <Text style={styles.interrogacao}>?</Text>
      </View>
    );
  }

  return (
    <Image
      source={fonte}
      style={style}
      resizeMode="contain"
      onError={() => setIndice((atual) => atual + 1)}
    />
  );
}

const styles = StyleSheet.create({
  vazio: { alignItems: 'center', justifyContent: 'center' },
  interrogacao: { fontSize: 36, color: '#B0B5BD', fontWeight: 'bold' },
});

// components/SpriteRemoto.js
// Imagem que tenta uma lista de fontes, uma de cada vez: se a primeira falhar, passa
// para a próxima; se todas falharem, mostra um "?".
// Props: fontes (lista de { uri }), style (largura e altura)

import React, { useState, useEffect } from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';

export default function SpriteRemoto({ fontes, style }) {
  const [indice, setIndice] = useState(0);

  // Se o componente for reaproveitado para outro Pokémon, recomeça da primeira fonte
  useEffect(() => {
    setIndice(0);
  }, [fontes]);

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

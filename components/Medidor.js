// components/Medidor.js
// Medidor de 5 quadrados: verde = vantagem, vermelho = desvantagem,
// sem cor = neutro. Quanto mais quadrados coloridos, mais forte o efeito.
// Props:
//   quadrados  quantos quadrados pintar (0 a 5)
//   sentido    'vantagem' | 'desvantagem' | 'neutro'
//   tamanho    lado de cada quadrado (opcional)

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COR } from '../data/tema';

const TOTAL = 5;

export default function Medidor({ quadrados, sentido, tamanho = 20 }) {
  const cor =
    sentido === 'vantagem' ? COR.verde : sentido === 'desvantagem' ? COR.vermelho : null;

  const descricao =
    sentido === 'neutro'
      ? 'Neutro'
      : `${sentido === 'vantagem' ? 'Vantagem' : 'Desvantagem'}, ${quadrados} de ${TOTAL}`;

  return (
    <View style={styles.linha} accessible accessibilityLabel={descricao}>
      {Array.from({ length: TOTAL }, (_, i) => {
        const pintado = cor && i < quadrados;
        return (
          <View
            key={i}
            style={[
              styles.quadrado,
              { width: tamanho, height: tamanho },
              pintado && { backgroundColor: cor, borderColor: cor },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row' },
  quadrado: {
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    marginLeft: 4,
  },
});

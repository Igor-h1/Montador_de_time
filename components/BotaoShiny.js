// components/BotaoShiny.js
// Botão "✨ Shiny" que alterna entre o sprite normal e o shiny.
// O shiny só existe na internet: sem conexão o botão fica desabilitado e avisa.
// Props: ativo (shiny ligado), desabilitado (sem internet), onPress

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COR } from '../data/tema';
import { tocarSom } from '../services/sons';

export default function BotaoShiny({ ativo, desabilitado, onPress }) {
  return (
    <View style={styles.caixa}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: ativo, disabled: desabilitado }}
        disabled={desabilitado}
        onPress={() => {
          tocarSom(ativo ? 'shinyDesativar' : 'shinyAtivar');
          if (onPress) onPress();
        }}
        style={({ pressed }) => [
          styles.botao,
          ativo && styles.ativo,
          desabilitado && styles.desabilitado,
          pressed && styles.pressionado,
        ]}
      >
        <Text style={[styles.texto, ativo && styles.textoAtivo]}>✨ Shiny</Text>
      </Pressable>
      {desabilitado ? <Text style={styles.dica}>Precisa de internet</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { alignItems: 'center', marginTop: 12 },
  botao: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COR.borda,
    backgroundColor: COR.branco,
  },
  ativo: { backgroundColor: COR.amarelo, borderColor: '#C9A000' },
  desabilitado: { opacity: 0.45 },
  pressionado: { opacity: 0.8 },
  texto: { fontSize: 14, fontWeight: '700', color: COR.texto },
  textoAtivo: { color: '#4A3B00' },
  dica: { fontSize: 11, color: COR.textoSuave, marginTop: 4 },
});

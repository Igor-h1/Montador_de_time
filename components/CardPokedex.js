// components/CardPokedex.js
// Cartão de Pokémon da Pokédex geral (consulta): sprite da internet, número nacional,
// nome e tipos. Sem cadeado nem disponibilidade, porque não depende de jogo.
// Props: pokemon, onPress (chamado com o pokemon), style
// React.memo evita redesenhar centenas de cards: quem usa deve passar um onPress estável.

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import BadgeTipo from './BadgeTipo';
import SpriteRemoto from './SpriteRemoto';
import { fontesSprite } from '../services/spritesGeral';
import { COR, SOMBRA } from '../data/tema';

function CardPokedex({ pokemon, onPress, style }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(pokemon)}
      style={({ pressed }) => [styles.card, pressed && styles.pressionado, style]}
    >
      <View style={styles.imagemBox}>
        <SpriteRemoto fontes={fontesSprite(pokemon.id)} style={styles.imagem} />
      </View>

      <Text style={styles.numero}>#{String(pokemon.id).padStart(3, '0')}</Text>
      <Text style={styles.nome} numberOfLines={1}>
        {pokemon.nome}
      </Text>

      <View style={styles.tipos}>
        {pokemon.tipos.map((tipo) => (
          <BadgeTipo key={tipo} tipo={tipo} pequeno />
        ))}
      </View>
    </Pressable>
  );
}

export default React.memo(CardPokedex);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COR.branco,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COR.borda,
    padding: 10,
    alignItems: 'center',
    ...SOMBRA,
  },
  pressionado: { opacity: 0.8 },
  imagemBox: {
    width: '100%',
    height: 104,
    borderRadius: 12,
    backgroundColor: COR.superficie,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagem: { width: 96, height: 96 },
  numero: { color: COR.textoSuave, fontSize: 12, marginTop: 8 },
  nome: { color: COR.texto, fontSize: 16, fontWeight: '700', marginTop: 2 },
  tipos: { flexDirection: 'row', justifyContent: 'center', marginTop: 6 },
});

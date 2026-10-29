import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { TIPOS } from '../data/tipos';
import { COR, SOMBRA } from '../data/tema';

export default function SlotEquipe({ pokemon, sprite, onPress, onRemover, style }) {
  const [erroImagem, setErroImagem] = useState(false);

  if (!pokemon) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => onPress && onPress()}
        style={({ pressed }) => [
          styles.slot,
          styles.vazio,
          pressed && styles.pressionado,
          style,
        ]}
      >
        <Text style={styles.mais}>+</Text>
      </Pressable>
    );
  }

  const mostrarImagem = sprite && !erroImagem;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress && onPress(pokemon)}
      style={({ pressed }) => [styles.slot, styles.cheio, pressed && styles.pressionado, style]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remover ${pokemon.nome} da equipe`}
        onPress={(event) => {
          event.stopPropagation();
          onRemover && onRemover(pokemon);
        }}
        hitSlop={8}
        style={styles.remover}
      >
        <Text style={styles.removerTexto}>✕</Text>
      </Pressable>

      {mostrarImagem ? (
        <Image
          source={sprite}
          style={styles.imagem}
          resizeMode="contain"
          onError={() => setErroImagem(true)}
        />
      ) : (
        <Text style={styles.interrogacao}>?</Text>
      )}

      <Text style={styles.nome} numberOfLines={1}>
        {pokemon.nome}
      </Text>

      <View style={styles.tipos}>
        {pokemon.tipos.map((tipo) => (
          <View key={tipo} style={[styles.bolinha, { backgroundColor: TIPOS[tipo].cor }]} />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    aspectRatio: 1,
    borderRadius: 18,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vazio: {
    backgroundColor: COR.superficie,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
  },
  cheio: {
    backgroundColor: COR.branco,
    borderWidth: 1,
    borderColor: COR.borda,
    ...SOMBRA,
  },
  pressionado: { opacity: 0.75 },
  mais: { fontSize: 38, color: COR.vermelho, fontWeight: '300' },
  remover: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COR.vermelho,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  removerTexto: { color: COR.branco, fontSize: 11, fontWeight: 'bold' },
  imagem: { width: 54, height: 54 },
  interrogacao: { fontSize: 28, color: '#B0B5BD', fontWeight: 'bold' },
  nome: { fontSize: 12, fontWeight: '700', color: COR.texto, marginTop: 2 },
  tipos: { flexDirection: 'row', marginTop: 4 },
  bolinha: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 2 },
});

// components/SlotEquipe.js
// Um dos 6 espaços da equipe: preenchido (sprite, nome, botão de remover)
// ou vazio (mostra "+").
// Props:
//   pokemon    objeto do Pokémon ou null/undefined para slot vazio
//   sprite     imagem local ou null
//   onPress    slot vazio: chamado sem argumentos (ex.: ir para a Pokédex)
//              slot preenchido: chamado com o pokemon (ex.: abrir detalhes)
//   onRemover  chamado com o pokemon ao tocar no ✕
//   style      estilo extra (ex.: largura na grade)

import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import BadgeTipo from './BadgeTipo';

export default function SlotEquipe({ pokemon, sprite, onPress, onRemover, style }) {
  const [erroImagem, setErroImagem] = useState(false);

  if (!pokemon) {
    return (
      <Pressable
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
      onPress={() => onPress && onPress(pokemon)}
      style={({ pressed }) => [styles.slot, pressed && styles.pressionado, style]}
    >
      <Pressable
        onPress={() => onRemover && onRemover(pokemon)}
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
          <BadgeTipo key={tipo} tipo={tipo} pequeno />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 8,
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  vazio: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#bbb',
    elevation: 0,
    shadowOpacity: 0,
  },
  pressionado: { opacity: 0.75 },
  mais: { fontSize: 40, color: '#bbb', fontWeight: '300' },
  remover: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  removerTexto: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  imagem: { width: 72, height: 72 },
  interrogacao: { fontSize: 32, color: '#aaa', fontWeight: 'bold' },
  nome: { fontSize: 13, fontWeight: '700', marginTop: 4, marginBottom: 4 },
  tipos: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
});

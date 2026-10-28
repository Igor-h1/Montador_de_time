// components/Card.js
// Cartão de Pokémon (usado na grade da Pokédex).
// Props:
//   pokemon     objeto { id, nome, tipos, ... } de data/pokemons.js
//   sprite      imagem local (resultado de obterSprite) ou null
//   disponivel  false = bloqueado (esmaecido, cadeado, sem toque)
//   onPress     callback chamado com o pokemon ao tocar
//   style       estilo extra (ex.: largura na grade)
//
// React.memo evita redesenhar os 386 cards à toa. Para funcionar, quem usa
// o Card deve passar um onPress estável (useCallback).

import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import BadgeTipo from './BadgeTipo';

function formatarNumero(id) {
  return '#' + String(id).padStart(3, '0');
}

function Card({ pokemon, sprite, disponivel = true, onPress, style }) {
  const [erroImagem, setErroImagem] = useState(false);
  const mostrarImagem = sprite && !erroImagem;

  return (
    <Pressable
      disabled={!disponivel}
      onPress={() => onPress && onPress(pokemon)}
      accessibilityState={{ disabled: !disponivel }}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressionado,
        style,
      ]}
    >
      <View style={!disponivel && styles.bloqueado}>
        <View style={styles.imagemBox}>
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
        </View>

        <Text style={styles.numero}>{formatarNumero(pokemon.id)}</Text>
        <Text style={styles.nome} numberOfLines={1}>
          {pokemon.nome}
        </Text>

        <View style={styles.tipos}>
          {pokemon.tipos.map((tipo) => (
            <BadgeTipo key={tipo} tipo={tipo} pequeno />
          ))}
        </View>
      </View>

      {!disponivel && <Text style={styles.cadeado}>🔒</Text>}
    </Pressable>
  );
}

export default React.memo(Card);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  pressionado: { opacity: 0.8 },
  bloqueado: { opacity: 0.35 },
  imagemBox: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagem: { width: 88, height: 88 },
  interrogacao: { fontSize: 36, color: '#aaa', fontWeight: 'bold' },
  numero: { fontSize: 11, color: '#888', marginTop: 4, textAlign: 'center' },
  nome: { fontSize: 15, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  tipos: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  cadeado: { position: 'absolute', top: 8, right: 10, fontSize: 18 },
});

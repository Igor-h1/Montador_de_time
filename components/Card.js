import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import BadgeTipo from './BadgeTipo';
import { COR, SOMBRA } from '../data/tema';

// Número da Pokédex do jogo (ex.: #001); quem não está nela mostra o número nacional
function rotuloNumero(pokemon) {
  const numero = pokemon.numeroRegional || pokemon.id;
  const texto = '#' + String(numero).padStart(3, '0');
  return pokemon.numeroRegional ? texto : 'Nac. ' + texto;
}

function Card({ pokemon, sprite, disponivel, onPress, style }) {
  const [erroImagem, setErroImagem] = useState(false);
  const mostrarImagem = sprite && !erroImagem;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !disponivel }}
      disabled={!disponivel}
      onPress={() => onPress(pokemon)}
      style={({ pressed }) => [
        styles.card,
        !disponivel && styles.indisponivel,
        pressed && styles.pressionado,
        style,
      ]}
    >
      {!disponivel ? (
        <Text style={styles.cadeado}>🔒</Text>
      ) : null}
      {mostrarImagem ? (
        <Image
          source={sprite}
          style={styles.sprite}
          resizeMode="contain"
          onError={() => setErroImagem(true)}
        />
      ) : (
        <Text style={styles.interrogacao}>?</Text>
      )}
      <Text style={styles.numero}>{rotuloNumero(pokemon)}</Text>
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

export default React.memo(Card);

const styles = StyleSheet.create({
  card: {
    minHeight: 190,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COR.branco,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COR.borda,
    padding: 10,
    ...SOMBRA,
  },
  indisponivel: { opacity: 0.65 },
  pressionado: { opacity: 0.75 },
  cadeado: { position: 'absolute', top: 8, right: 8, zIndex: 1 },
  sprite: { width: 100, height: 100 },
  interrogacao: { height: 100, textAlignVertical: 'center', fontSize: 48, color: '#B0B5BD' },
  numero: { color: COR.textoSuave, fontSize: 12 },
  nome: { color: COR.texto, fontSize: 16, fontWeight: '700', marginTop: 2 },
  tipos: { flexDirection: 'row', justifyContent: 'center', marginTop: 6 },
});

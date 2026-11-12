import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { SOMBRA } from '../data/tema';
import { useEstilos } from '../services/tema';
import { tocarSom } from '../services/sons';

export default function CapaJogo({ jogo, capa, quantidade, max, onPress, style }) {
  const styles = useEstilos(criarEstilos);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${jogo.nome}, ${quantidade} de ${max} Pokémon na equipe`}
      onPress={() => {
        tocarSom('confirmar');
        if (onPress) onPress();
      }}
      style={({ pressed }) => [styles.cartao, pressed && styles.pressionado, style]}
    >
      {capa ? (
        <View style={styles.capa}>
          <Image source={capa} style={styles.capaImagem} resizeMode="cover" />
          {/* No modo escuro, um véu leve escurece a capa para o branco da arte não ofuscar */}
          <View pointerEvents="none" style={styles.pelicula} />
        </View>
      ) : (
        <View style={[styles.capaVazia, { backgroundColor: jogo.cor }]}>
          <Text style={styles.iniciais}>{jogo.nome}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={1}>
          {jogo.nome}
        </Text>
        <Text style={styles.quantidade}>
          {quantidade}/{max} Pokémon
        </Text>
      </View>
    </Pressable>
  );
}

const criarEstilos = (COR) => StyleSheet.create({
  cartao: {
    overflow: 'hidden',
    backgroundColor: COR.cartao,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COR.borda,
    ...SOMBRA,
  },
  pressionado: { opacity: 0.8 },
  capa: { width: '100%', height: 150 },
  capaImagem: { width: '100%', height: '100%' },
  pelicula: { ...StyleSheet.absoluteFillObject, backgroundColor: COR.peliculaCapa },
  capaVazia: { height: 150, alignItems: 'center', justifyContent: 'center', padding: 12 },
  iniciais: { color: COR.branco, fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  info: { padding: 12 },
  nome: { color: COR.texto, fontSize: 16, fontWeight: 'bold' },
  quantidade: { color: COR.textoSuave, fontSize: 12, marginTop: 4 },
});

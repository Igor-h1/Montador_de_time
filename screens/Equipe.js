// screens/Equipe.js  (PROVISÓRIA - os 6 slots e as fraquezas vêm na Etapa 6)
// Por enquanto lista a equipe do jogo e testa a remoção pelo Context.

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Cabecalho from '../components/Cabecalho';
import Botao from '../components/Botao';
import { JOGOS } from '../data/jogos';
import { useEquipe } from '../context/EquipeContext';

export default function Equipe({ route }) {
  const jogoId = route.params.jogo;
  const jogo = JOGOS[jogoId];
  const { pokemonsDaEquipe, remover, MAX_EQUIPE } = useEquipe();
  const lista = pokemonsDaEquipe(jogoId);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Cabecalho
        titulo={`Equipe ${jogo.nome}`}
        subtitulo={`${lista.length}/${MAX_EQUIPE} Pokémon`}
        cor={jogo.cor}
      />

      {lista.length === 0 ? (
        <Text style={styles.vazio}>Adicione Pokémon para montar seu time</Text>
      ) : (
        lista.map((pokemon) => (
          <View key={pokemon.id} style={styles.linha}>
            <Text style={styles.nome}>
              #{pokemon.id} {pokemon.nome}
            </Text>
            <Botao
              texto="Remover"
              variante="perigo"
              onPress={() => remover(pokemon.id, jogoId)}
            />
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f2f2f2', flexGrow: 1 },
  vazio: { textAlign: 'center', color: '#888', marginTop: 24 },
  linha: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10 },
  nome: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
});

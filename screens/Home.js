// screens/Home.js
// Primeira tela: o usuário escolhe o jogo. O jogo vai para a Pokédex
// pelo route.params ({ jogo: 'firered' }).

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Cabecalho from '../components/Cabecalho';
import Botao from '../components/Botao';
import { LISTA_JOGOS } from '../data/jogos';
import { useEquipe } from '../context/EquipeContext';

export default function Home({ navigation }) {
  const { equipe, MAX_EQUIPE } = useEquipe();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Cabecalho
        titulo="Pokédex Gen 3"
        subtitulo="Escolha o jogo para ver tipos e fraquezas"
      />

      {LISTA_JOGOS.map((jogo) => (
        <View key={jogo.id} style={styles.bloco}>
          <Botao
            texto={`Pokémon ${jogo.nome}`}
            cor={jogo.cor}
            onPress={() => navigation.navigate('Pokedex', { jogo: jogo.id })}
          />
          <Text style={styles.info}>
            Equipe: {equipe[jogo.id].length}/{MAX_EQUIPE}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f2f2f2', flexGrow: 1 },
  bloco: { marginBottom: 12 },
  info: { textAlign: 'center', color: '#666', fontSize: 13 },
});

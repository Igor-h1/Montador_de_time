// screens/Home.js
// Primeira tela: o usuário escolhe o jogo. O jogo vai para a Pokédex
// pelo route.params ({ jogo: 'firered' }).
// - Jogos offline (FireRed e Emerald): sempre aparecem.
// - Jogos online: só aparecem quando há internet. Sem internet, um aviso
//   explica por que sumiram. Quando a conexão volta, eles reaparecem sozinhos.

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Cabecalho from '../components/Cabecalho';
import Botao from '../components/Botao';
import { LISTA_JOGOS } from '../data/jogos';
import { useEquipe } from '../context/EquipeContext';
import useRede from '../services/useRede';

const JOGOS_OFFLINE = LISTA_JOGOS.filter((jogo) => jogo.offline);
const JOGOS_ONLINE = LISTA_JOGOS.filter((jogo) => !jogo.offline);

export default function Home({ navigation }) {
  const { equipe, MAX_EQUIPE } = useEquipe();
  const online = useRede(); // true | false | null (ainda verificando)

  function renderJogo(jogo) {
    return (
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
    );
  }

  const nomesOffline = JOGOS_OFFLINE.map((jogo) => jogo.nome).join(' e ');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Cabecalho
        titulo="Pokédex Gen 3 a 5"
        subtitulo="Escolha o jogo para ver tipos e fraquezas"
      />

      {online === false ? (
        <Text style={styles.aviso}>
          📡 Sem internet: os jogos online ficam ocultos. {nomesOffline} funcionam
          normalmente.
        </Text>
      ) : null}

      <Text style={styles.secao}>Jogos offline</Text>
      {JOGOS_OFFLINE.map(renderJogo)}

      {online === true ? (
        <>
          <Text style={styles.secao}>Jogos online (precisam de internet)</Text>
          {JOGOS_ONLINE.map(renderJogo)}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f2f2f2', flexGrow: 1 },
  aviso: {
    backgroundColor: '#fff3cd',
    color: '#664d03',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  secao: { fontSize: 14, fontWeight: 'bold', color: '#555', marginTop: 8, marginBottom: 8 },
  bloco: { marginBottom: 8 },
  info: { textAlign: 'center', color: '#666', fontSize: 13 },
});

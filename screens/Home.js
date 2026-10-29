// screens/Home.js
// Página inicial: título, aviso de falta de internet e a lista de jogos com
// capa e nome. Tocar em um jogo abre a Equipe dele (jogo vai por route.params).
// - FireRed e Emerald (offline): sempre aparecem.
// - Jogos online: só aparecem com internet; quando a conexão volta, eles
//   reaparecem sozinhos.

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Cabecalho from '../components/Cabecalho';
import CapaJogo from '../components/CapaJogo';
import { LISTA_JOGOS } from '../data/jogos';
import { CAPAS } from '../data/capas';
import { COR } from '../data/tema';
import { useEquipe } from '../context/EquipeContext';
import useRede from '../services/useRede';

// "A, B e C"
function juntarNomes(nomes) {
  if (nomes.length <= 1) return nomes.join('');
  return nomes.slice(0, -1).join(', ') + ' e ' + nomes[nomes.length - 1];
}

const NOMES_OFFLINE = juntarNomes(
  LISTA_JOGOS.filter((jogo) => jogo.offline).map((jogo) => jogo.nome)
);

export default function Home({ navigation }) {
  const { equipe, MAX_EQUIPE } = useEquipe();
  const insets = useSafeAreaInsets(); // margem para os botões do Android
  const online = useRede(); // true | false | null (ainda verificando)

  // Offline sempre; online só com internet
  const jogosVisiveis = LISTA_JOGOS.filter((jogo) => jogo.offline || online === true);

  return (
    <View style={styles.container}>
      <Cabecalho titulo="Pokédex" subtitulo="Escolha o jogo para montar sua equipe" />

      {online === false ? (
        <View style={styles.aviso}>
          <Text style={styles.avisoTexto}>
            📡 Sem internet: só {NOMES_OFFLINE} aparecem. Os outros jogos voltam quando
            você se conectar.
          </Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={[styles.conteudo, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.grade}>
          {jogosVisiveis.map((jogo) => (
            <CapaJogo
              key={jogo.id}
              jogo={jogo}
              capa={CAPAS[jogo.id]}
              quantidade={equipe[jogo.id].length}
              max={MAX_EQUIPE}
              onPress={() => navigation.navigate('Equipe', { jogo: jogo.id })}
              style={styles.capaLargura}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COR.fundo },
  aviso: {
    backgroundColor: '#FFF4CC',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 12,
  },
  avisoTexto: { color: '#6B5200', fontSize: 13 },
  conteudo: { padding: 16, paddingTop: 20 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  capaLargura: { width: '47%' },
});

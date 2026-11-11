// screens/Home.js
// Montar time (opção do menu): aviso de falta de internet e os jogos separados por
// região (data/regioes.js), cada um com capa e nome. Tocar em um jogo abre a Equipe
// dele (jogo vai por route.params).
// - Jogos offline (FireRed, LeafGreen, Ruby, Sapphire e Emerald): sempre aparecem.
// - Jogos online: só aparecem com internet; quando a conexão volta, eles reaparecem
//   sozinhos. Uma região sem nenhum jogo visível não aparece.
// - No fim fica o Ambiente livre (qualquer Pokémon, sprites da internet): só com internet.

import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CapaJogo from '../components/CapaJogo';
import { JOGOS, LISTA_JOGOS } from '../data/jogos';
import { REGIOES } from '../data/regioes';
import { ID_LIVRE, NOME_LIVRE } from '../data/livre';
import { CAPAS } from '../data/capas';
import { COR } from '../data/tema';
import { useEquipe } from '../context/EquipeContext';
import useRede from '../services/useRede';
import { tocarSom } from '../services/sons';

// "A, B e C"
function juntarNomes(nomes) {
  if (nomes.length <= 1) return nomes.join('');
  return nomes.slice(0, -1).join(', ') + ' e ' + nomes[nomes.length - 1];
}

const NOMES_OFFLINE = juntarNomes(
  LISTA_JOGOS.filter((jogo) => jogo.offline).map((jogo) => jogo.nome)
);

const IDS_EM_REGIOES = new Set(REGIOES.flatMap((regiao) => regiao.jogos));

export default function Home({ navigation }) {
  const { equipe, MAX_EQUIPE } = useEquipe();
  const insets = useSafeAreaInsets(); // margem para os botões do Android
  const online = useRede(); // true | false | null (ainda verificando)

  // Offline sempre; online só com internet
  const visivel = (jogo) => Boolean(jogo) && jogo.ativo && (jogo.offline || online === true);

  // Jogos de cada região, só os visíveis
  const grupos = REGIOES.map((regiao) => ({
    id: regiao.id,
    nome: regiao.nome,
    jogos: regiao.jogos.map((id) => JOGOS[id]).filter(visivel),
  }));

  // Segurança: jogo que não está em nenhuma região vai para "Outros"
  const outros = LISTA_JOGOS.filter((jogo) => !IDS_EM_REGIOES.has(jogo.id) && visivel(jogo));
  if (outros.length > 0) grupos.push({ id: 'outros', nome: 'Outros', jogos: outros });

  const gruposVisiveis = grupos.filter((grupo) => grupo.jogos.length > 0);

  return (
    <View style={styles.container}>
      {online === false ? (
        <View style={styles.aviso}>
          <Text style={styles.avisoTexto}>
            📡 Sem internet: só {NOMES_OFFLINE} aparecem. Os outros jogos voltam quando
            você se conectar. O ambiente livre também precisa de internet.
          </Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={[styles.conteudo, { paddingBottom: insets.bottom + 16 }]}>
        {gruposVisiveis.map((grupo) => (
          <View key={grupo.id} style={styles.regiao}>
            <View style={styles.cabecaRegiao}>
              <View style={styles.marca} />
              <Text style={styles.nomeRegiao}>{grupo.nome}</Text>
              <Text style={styles.contagemRegiao}>
                {grupo.jogos.length} {grupo.jogos.length === 1 ? 'jogo' : 'jogos'}
              </Text>
            </View>

            <View style={styles.grade}>
              {grupo.jogos.map((jogo) => (
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
          </View>
        ))}

        {online === true ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              tocarSom('confirmar');
              navigation.navigate('EquipeLivre');
            }}
            style={({ pressed }) => [styles.livre, pressed && styles.pressionado]}
          >
            <Text style={styles.livreIcone}>🌍</Text>
            <View style={styles.livreTextos}>
              <Text style={styles.livreNome}>{NOME_LIVRE}</Text>
              <Text style={styles.livreDescricao}>
                Escolha qualquer Pokémon e veja como o time se sai contra o campeão de cada região.
              </Text>
              <Text style={styles.livreEquipe}>
                Equipe {equipe[ID_LIVRE].length}/{MAX_EQUIPE}
              </Text>
            </View>
          </Pressable>
        ) : null}
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

  regiao: { marginBottom: 8 },
  cabecaRegiao: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  marca: { width: 5, height: 22, borderRadius: 3, backgroundColor: COR.vermelho, marginRight: 10 },
  nomeRegiao: { fontSize: 20, fontWeight: 'bold', color: COR.texto },
  contagemRegiao: { fontSize: 12, color: COR.textoSuave, marginLeft: 10, marginTop: 3 },

  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  pressionado: { opacity: 0.8 },

  livre: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COR.superficie,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COR.vermelho,
    borderStyle: 'dashed',
    padding: 14,
    marginTop: 8,
  },
  livreIcone: { fontSize: 34, marginRight: 14 },
  livreTextos: { flex: 1 },
  livreNome: { fontSize: 18, fontWeight: 'bold', color: COR.texto },
  livreDescricao: { fontSize: 12, color: COR.textoSuave, marginTop: 2 },
  livreEquipe: { fontSize: 12, fontWeight: '700', color: COR.vermelho, marginTop: 6 },
  capaLargura: { width: '47%' },
});

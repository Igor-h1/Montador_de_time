// screens/EliteLivre.js
// "Saiba mais" do ambiente livre: só os CAMPEÕES de cada região, com o time de cada um,
// o confronto contra a sua equipe e um "Saiba mais" (Bulbapedia) em cada Pokémon.
// No fim, um botão leva para a Elite dos 4 e as lutas pós-game (EliteLivreCompleta).
// Os sprites usam a mesma regra da Pokédex geral.

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CartaoTreinador from '../components/CartaoTreinador';
import SeloNivel from '../components/SeloNivel';
import Botao from '../components/Botao';
import { useEstilos } from '../services/tema';
import { ID_LIVRE } from '../data/livre';
import { analisarEliteLivre } from '../services/eliteService';
import { buscarPorNome } from '../services/pokemonService';
import { fontesSprite } from '../services/spritesGeral';
import { abrirLink, urlWiki } from '../services/links';
import { useEquipe } from '../context/EquipeContext';

export default function EliteLivre({ navigation }) {
  const styles = useEstilos(criarEstilos);
  const insets = useSafeAreaInsets();
  const { pokemonsDaEquipe } = useEquipe();
  const [aviso, setAviso] = useState(null);

  const equipe = useMemo(() => pokemonsDaEquipe(ID_LIVRE), [pokemonsDaEquipe]);
  const analise = useMemo(() => analisarEliteLivre(equipe), [equipe]);
  const idsMaisDificeis = useMemo(() => analise.maisDificeis.map((t) => t.chave), [analise]);

  // Sprite do Pokémon da Elite: mesma regra da Pokédex geral
  const fontesDe = useCallback((nome) => {
    const base = buscarPorNome(nome);
    return base ? fontesSprite(base.id) : [];
  }, []);

  async function aoAbrirWiki(nome) {
    const resultado = await abrirLink(urlWiki(nome));
    setAviso(resultado.ok ? null : resultado.motivo);
  }

  const renderItem = useCallback(
    ({ item }) => (
      <CartaoTreinador
        treinador={item}
        temEquipe={analise.temEquipe}
        maisDificil={idsMaisDificeis.includes(item.chave)}
        onWiki={aoAbrirWiki}
        fontesDe={fontesDe}
      />
    ),
    [analise.temEquipe, idsMaisDificeis, fontesDe]
  );

  const cabecalho = (
    <View>
      <View style={styles.resumo}>
        <Text style={styles.resumoTitulo}>Resumo para a sua equipe</Text>

        {analise.temEquipe ? (
          <>
            <View style={styles.resumoLinha}>
              <Text style={styles.resumoRotulo}>Dificuldade estimada</Text>
              <SeloNivel nivel={analise.dificuldade} />
            </View>
            <Text style={styles.resumoTexto}>
              {analise.maisDificeis.length > 0
                ? `Mais difícil contra: ${analise.maisDificeis
                    .map((t) => `${t.nome} (${t.subtitulo})`)
                    .join(', ')}.`
                : 'Nenhum campeão deixa a sua equipe em desvantagem pelos tipos.'}
            </Text>
          </>
        ) : (
          <Text style={styles.resumoTexto}>
            Adicione Pokémon à equipe para ver como ela se sai. Enquanto isso, você pode
            conhecer os times dos campeões abaixo.
          </Text>
        )}

        <Text style={styles.aviso}>
          Estimativa só pelos tipos: não considera nível, golpes, habilidades nem itens.
        </Text>
      </View>

      {aviso ? <Text style={styles.faixaErro}>{aviso}</Text> : null}
    </View>
  );

  const rodape = (
    <View style={styles.rodape}>
      <Text style={styles.rodapeTexto}>
        Quer ver também os outros treinadores de cada região, jogo a jogo?
      </Text>
      <Botao
        texto="Ver Elite dos 4 e lutas pós-game"
        variante="secundaria"
        onPress={() => navigation.navigate('EliteLivreCompleta')}
      />
    </View>
  );

  return (
    <FlatList
      data={analise.campeoes}
      keyExtractor={(item) => item.chave}
      renderItem={renderItem}
      ListHeaderComponent={cabecalho}
      ListFooterComponent={rodape}
      initialNumToRender={3}
      windowSize={7}
      style={styles.lista}
      contentContainerStyle={[styles.conteudo, { paddingBottom: insets.bottom + 16 }]}
    />
  );
}

const criarEstilos = (COR) => StyleSheet.create({
  lista: { backgroundColor: COR.fundo },
  conteudo: { padding: 16 },

  resumo: { backgroundColor: COR.superficie, borderRadius: 16, padding: 14, marginBottom: 12 },
  resumoTitulo: { fontSize: 16, fontWeight: 'bold', color: COR.texto, marginBottom: 10 },
  resumoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resumoRotulo: { fontSize: 15, fontWeight: '600', color: COR.texto },
  resumoTexto: { color: COR.texto, marginBottom: 8 },
  aviso: { fontSize: 11, color: COR.textoSuave },
  faixaErro: {
    backgroundColor: COR.erroFundo,
    color: COR.erroTexto,
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },

  rodape: { marginTop: 8 },
  rodapeTexto: { color: COR.textoSuave, fontSize: 13, textAlign: 'center', marginBottom: 8 },
});

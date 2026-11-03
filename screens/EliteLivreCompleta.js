// screens/EliteLivreCompleta.js
// Ambiente livre: a Elite dos 4 e as lutas pós-game de cada região, jogo a jogo, com o
// confronto de cada Pokémon contra a equipe e um "Saiba mais" (Bulbapedia) em cada um.
// Os campeões ficam na tela anterior (EliteLivre). Usa uma lista por seções (SectionList)
// porque são muitos treinadores. Os sprites usam a mesma regra da Pokédex geral.

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CartaoTreinador from '../components/CartaoTreinador';
import { COR } from '../data/tema';
import { ID_LIVRE } from '../data/livre';
import { analisarEliteLivre } from '../services/eliteService';
import { buscarPorNome } from '../services/pokemonService';
import { fontesSprite } from '../services/spritesGeral';
import { abrirLink, urlWiki } from '../services/links';
import { useEquipe } from '../context/EquipeContext';

export default function EliteLivreCompleta() {
  const insets = useSafeAreaInsets();
  const { pokemonsDaEquipe } = useEquipe();
  const [aviso, setAviso] = useState(null);

  const equipe = useMemo(() => pokemonsDaEquipe(ID_LIVRE), [pokemonsDaEquipe]);
  const analise = useMemo(() => analisarEliteLivre(equipe), [equipe]);

  // Uma seção por conjunto de jogos (ex.: "FireRed / LeafGreen"), sem os campeões; o título
  // da região aparece só na primeira seção de cada região
  const secoes = useMemo(
    () =>
      analise.regioes.flatMap((regiao) =>
        regiao.conjuntos.map((conjunto, i) => ({
          key: conjunto.id,
          regiao: regiao.nome,
          mostrarRegiao: i === 0,
          jogos: conjunto.jogos.join(' / '),
          data: conjunto.treinadores.filter((t) => t.categoria !== 'campeao'),
        }))
      ),
    [analise]
  );

  const idsMaisDificeis = useMemo(
    () => analise.maisDificeisOutros.map((t) => t.chave),
    [analise]
  );

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

  const renderSecao = useCallback(
    ({ section }) => (
      <View style={styles.cabecaSecao}>
        {section.mostrarRegiao ? (
          <View style={styles.regiaoLinha}>
            <View style={styles.marca} />
            <Text style={styles.nomeRegiao}>{section.regiao}</Text>
          </View>
        ) : null}
        <Text style={styles.nomeJogos}>{section.jogos}</Text>
      </View>
    ),
    []
  );

  const cabecalho = (
    <View>
      <View style={styles.resumo}>
        <Text style={styles.resumoTitulo}>Elite dos 4 e pós-game</Text>

        {analise.temEquipe ? (
          <Text style={styles.resumoTexto}>
            {analise.maisDificeisOutros.length > 0
              ? `Mais difícil contra: ${analise.maisDificeisOutros
                  .map((t) => `${t.nome} (${t.subtitulo})`)
                  .join(', ')}.`
              : 'Nenhum desses treinadores deixa a sua equipe em desvantagem pelos tipos.'}
          </Text>
        ) : (
          <Text style={styles.resumoTexto}>
            Adicione Pokémon à equipe para ver como ela se sai. Enquanto isso, você pode
            conhecer os times abaixo.
          </Text>
        )}

        <Text style={styles.aviso}>
          Estimativa só pelos tipos: não considera nível, golpes, habilidades nem itens. Os
          campeões estão na tela anterior.
        </Text>
      </View>

      {aviso ? <Text style={styles.faixaErro}>{aviso}</Text> : null}
    </View>
  );

  return (
    <SectionList
      sections={secoes}
      keyExtractor={(item) => item.chave}
      renderItem={renderItem}
      renderSectionHeader={renderSecao}
      ListHeaderComponent={cabecalho}
      stickySectionHeadersEnabled={false}
      initialNumToRender={4}
      windowSize={7}
      style={styles.lista}
      contentContainerStyle={[styles.conteudo, { paddingBottom: insets.bottom + 16 }]}
    />
  );
}

const styles = StyleSheet.create({
  lista: { backgroundColor: COR.fundo },
  conteudo: { padding: 16 },

  resumo: { backgroundColor: COR.superficie, borderRadius: 16, padding: 14, marginBottom: 8 },
  resumoTitulo: { fontSize: 16, fontWeight: 'bold', color: COR.texto, marginBottom: 10 },
  resumoTexto: { color: COR.texto, marginBottom: 8 },
  aviso: { fontSize: 11, color: COR.textoSuave },
  faixaErro: {
    backgroundColor: '#F8D7DA',
    color: '#842029',
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    marginVertical: 8,
    overflow: 'hidden',
  },

  cabecaSecao: { marginTop: 14, marginBottom: 8 },
  regiaoLinha: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  marca: { width: 5, height: 22, borderRadius: 3, backgroundColor: COR.vermelho, marginRight: 10 },
  nomeRegiao: { fontSize: 20, fontWeight: 'bold', color: COR.texto },
  nomeJogos: { fontSize: 14, fontWeight: '700', color: COR.textoSuave },
});

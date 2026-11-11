// screens/Elite.js
// "Saiba mais" do gráfico da Equipe: mostra onde a equipe tem mais dificuldade e
// os times da Elite dos 4 (e campeão) da região, com um "Saiba mais" (Bulbapedia)
// em cada Pokémon. Jogo vem por route.params ({ jogo }).

import React, { useMemo, useState, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CartaoTreinador from '../components/CartaoTreinador';
import SeloNivel from '../components/SeloNivel';
import { useEstilos } from '../services/tema';
import { analisarElite } from '../services/eliteService';
import { buscarPorNome, obterSprite } from '../services/pokemonService';
import { abrirLink, urlWiki } from '../services/links';
import { useEquipe } from '../context/EquipeContext';

export default function Elite({ route }) {
  const styles = useEstilos(criarEstilos);
  const jogoId = route.params.jogo;
  const insets = useSafeAreaInsets();
  const { pokemonsDaEquipe } = useEquipe();
  const [aviso, setAviso] = useState(null);

  const equipe = useMemo(() => pokemonsDaEquipe(jogoId), [pokemonsDaEquipe, jogoId]);
  const analise = useMemo(() => analisarElite(jogoId, equipe), [jogoId, equipe]);

  // Sprite do Pokémon da Elite no jogo da tela (nome -> lista de fontes)
  const fontesDe = useCallback(
    (nome) => {
      const base = buscarPorNome(nome);
      const sprite = base ? obterSprite(base.id, jogoId) : null;
      return sprite ? [sprite] : [];
    },
    [jogoId]
  );

  async function aoAbrirWiki(nome) {
    const resultado = await abrirLink(urlWiki(nome));
    setAviso(resultado.ok ? null : resultado.motivo);
  }

  if (!analise) {
    return (
      <View style={styles.centro}>
        <Text style={styles.suave}>Este jogo ainda não tem dados da Elite dos 4.</Text>
      </View>
    );
  }

  const idsMaisDificeis = analise.maisDificeis.map((t) => t.id);

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
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
                ? `Mais difícil contra: ${analise.maisDificeis.map((t) => t.nome).join(', ')}.`
                : 'Nenhum treinador deixa a sua equipe em desvantagem pelos tipos.'}
            </Text>
          </>
        ) : (
          <Text style={styles.resumoTexto}>
            Adicione Pokémon à equipe para ver como ela se sai. Enquanto isso, você pode
            conhecer os times abaixo.
          </Text>
        )}

        <Text style={styles.aviso}>
          Estimativa só pelos tipos: não considera nível, golpes, habilidades nem itens.
        </Text>
      </View>

      {aviso ? <Text style={styles.faixaErro}>{aviso}</Text> : null}

      <Text style={styles.secao}>Elite dos 4 · {analise.regiao}</Text>
      {analise.principais.map((treinador) => (
        <CartaoTreinador
          key={treinador.id}
          treinador={treinador}
          temEquipe={analise.temEquipe}
          maisDificil={idsMaisDificeis.includes(treinador.id)}
          onWiki={aoAbrirWiki}
          fontesDe={fontesDe}
        />
      ))}

      {analise.posgame.length > 0 ? (
        <>
          <Text style={styles.secao}>Pós-game</Text>
          {analise.posgame.map((treinador) => (
            <CartaoTreinador
              key={treinador.id}
              treinador={treinador}
              temEquipe={analise.temEquipe}
              maisDificil={false}
              onWiki={aoAbrirWiki}
              fontesDe={fontesDe}
            />
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

const criarEstilos = (COR) => StyleSheet.create({
  container: { padding: 16, backgroundColor: COR.fundo, flexGrow: 1 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  suave: { color: COR.textoSuave, textAlign: 'center' },

  resumo: { backgroundColor: COR.superficie, borderRadius: 16, padding: 14, marginBottom: 8 },
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
    marginVertical: 8,
    overflow: 'hidden',
  },

  secao: { fontSize: 18, fontWeight: 'bold', color: COR.texto, marginTop: 16, marginBottom: 8 },
});

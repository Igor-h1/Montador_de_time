// screens/Equipe.js
// Os 6 slots da equipe do jogo (jogo vem por route.params), com:
// - remover Pokémon (pelo Context)
// - resumo dos tipos da equipe
// - alerta de fraquezas em comum (2 ou mais Pokémon fracos ao mesmo tipo)

import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Cabecalho from '../components/Cabecalho';
import Botao from '../components/Botao';
import SlotEquipe from '../components/SlotEquipe';
import BadgeTipo from '../components/BadgeTipo';
import { JOGOS } from '../data/jogos';
import { LISTA_TIPOS, TIPOS, multiplicador } from '../data/tipos';
import { obterSprite } from '../services/pokemonService';
import { useEquipe } from '../context/EquipeContext';

// A partir de quantos Pokémon fracos ao mesmo tipo o app alerta
const MINIMO_FRAQUEZA_COMUM = 2;

export default function Equipe({ navigation, route }) {
  const jogoId = route.params.jogo;
  const jogo = JOGOS[jogoId];
  const { pokemonsDaEquipe, remover, MAX_EQUIPE } = useEquipe();

  const lista = useMemo(() => pokemonsDaEquipe(jogoId), [pokemonsDaEquipe, jogoId]);
  const slots = Array.from({ length: MAX_EQUIPE }, (_, i) => lista[i] || null);

  // Quantos Pokémon da equipe têm cada tipo: [['fire', 2], ['flying', 1], ...]
  const resumoTipos = useMemo(() => {
    const contagem = {};
    lista.forEach((p) =>
      p.tipos.forEach((tipo) => {
        contagem[tipo] = (contagem[tipo] || 0) + 1;
      })
    );
    return Object.entries(contagem).sort((a, b) => b[1] - a[1]);
  }, [lista]);

  // Para cada tipo atacante, quais Pokémon da equipe sofrem mais de 1x de dano.
  // Só ficam os tipos que atingem MINIMO_FRAQUEZA_COMUM ou mais Pokémon.
  const fraquezasComuns = useMemo(
    () =>
      LISTA_TIPOS.map((atacante) => ({
        tipo: atacante,
        fracos: lista.filter((p) => multiplicador(atacante, p.tipos) > 1),
      }))
        .filter((f) => f.fracos.length >= MINIMO_FRAQUEZA_COMUM)
        .sort((a, b) => b.fracos.length - a.fracos.length),
    [lista]
  );

  // Slot preenchido abre os Detalhes; slot vazio abre a Pokédex
  function aoTocarSlot(pokemon) {
    if (pokemon) {
      navigation.navigate('Detalhes', { pokemonId: pokemon.id, jogo: jogoId });
    } else {
      navigation.navigate('Pokedex', { jogo: jogoId });
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Cabecalho
        titulo={`Equipe ${jogo.nome}`}
        subtitulo={`${lista.length}/${MAX_EQUIPE} Pokémon`}
        cor={jogo.cor}
      />

      <View style={styles.grade}>
        {slots.map((pokemon, indice) => (
          <SlotEquipe
            key={indice}
            pokemon={pokemon}
            sprite={pokemon ? obterSprite(pokemon.id, jogoId) : null}
            onPress={aoTocarSlot}
            onRemover={(p) => remover(p.id, jogoId)}
            style={styles.slot}
          />
        ))}
      </View>

      {lista.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioTexto}>Adicione Pokémon para montar seu time</Text>
          <Botao
            texto="Abrir Pokédex"
            cor={jogo.cor}
            onPress={() => navigation.navigate('Pokedex', { jogo: jogoId })}
          />
        </View>
      ) : (
        <>
          <View style={styles.secao}>
            <Text style={styles.titulo}>Tipos da equipe</Text>
            <View style={styles.linha}>
              {resumoTipos.map(([tipo, quantidade]) => (
                <View key={tipo} style={styles.tipoItem}>
                  <BadgeTipo tipo={tipo} />
                  <Text style={styles.quantidade}>×{quantidade}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.secao}>
            <Text style={styles.titulo}>Fraquezas em comum</Text>

            {lista.length < 2 ? (
              <Text style={styles.dica}>
                Adicione mais um Pokémon para comparar as fraquezas da equipe.
              </Text>
            ) : fraquezasComuns.length === 0 ? (
              <Text style={styles.semFraqueza}>✅ Nenhuma fraqueza em comum</Text>
            ) : (
              <>
                <Text style={styles.alerta}>
                  ⚠️ Sua equipe é fraca contra{' '}
                  {fraquezasComuns.map((f) => TIPOS[f.tipo].nome).join(', ')}
                </Text>
                {fraquezasComuns.map((f) => (
                  <View key={f.tipo} style={styles.fraquezaLinha}>
                    <BadgeTipo tipo={f.tipo} />
                    <Text style={styles.fraquezaTexto}>
                      {f.fracos.length} Pokémon: {f.fracos.map((p) => p.nome).join(', ')}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f2f2f2', flexGrow: 1 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  slot: { width: '31.5%', marginBottom: 10 },
  vazio: { alignItems: 'center', marginTop: 16 },
  vazioTexto: { color: '#888', fontSize: 16, marginBottom: 16, textAlign: 'center' },
  secao: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginTop: 8, marginBottom: 8 },
  titulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  linha: { flexDirection: 'row', flexWrap: 'wrap' },
  tipoItem: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  quantidade: { fontSize: 12, color: '#555', marginBottom: 6, marginRight: 4 },
  dica: { color: '#777' },
  semFraqueza: { color: '#0f5132', fontWeight: '600' },
  alerta: { color: '#842029', fontWeight: '700', marginBottom: 10 },
  fraquezaLinha: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 },
  fraquezaTexto: { fontSize: 13, color: '#444', flexShrink: 1, marginBottom: 6 },
});

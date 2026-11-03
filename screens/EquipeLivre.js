// screens/EquipeLivre.js
// Ambiente livre: uma equipe à parte, com qualquer um dos 649 Pokémon.
// - 6 quadrados: vazio abre a Pokédex geral para ESCOLHER; preenchido abre os detalhes
// - resumo dos tipos (e "Ver detalhes" por tipo, tela Tipos)
// - gráfico contra o campeão de cada região (o "Saiba mais" abre a EliteLivre, com todos
//   os treinadores da Elite dos 4 de todas as regiões)
// Os sprites usam a mesma regra da Pokédex geral (services/spritesGeral.js).

import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SlotEquipe from '../components/SlotEquipe';
import BadgeTipo from '../components/BadgeTipo';
import GraficoElite from '../components/GraficoElite';
import Botao from '../components/Botao';
import { COR } from '../data/tema';
import { ID_LIVRE, NOME_LIVRE } from '../data/livre';
import { fontesSprite } from '../services/spritesGeral';
import { analisarEliteLivre } from '../services/eliteService';
import { useEquipe } from '../context/EquipeContext';

export default function EquipeLivre({ navigation }) {
  const { pokemonsDaEquipe, remover, MAX_EQUIPE } = useEquipe();
  const insets = useSafeAreaInsets(); // margem para os botões do Android

  const lista = useMemo(() => pokemonsDaEquipe(ID_LIVRE), [pokemonsDaEquipe]);
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

  // Contra os campeões de todas as regiões
  const analise = useMemo(() => analisarEliteLivre(lista), [lista]);

  // Formato que o GraficoElite espera: uma linha por campeão
  const dadosGrafico = useMemo(
    () => ({
      regiao: '',
      principais: analise.campeoes,
      temEquipe: analise.temEquipe,
      dificuldade: analise.dificuldade,
    }),
    [analise]
  );

  // Slot preenchido abre os detalhes; slot vazio abre a Pokédex geral para escolher
  function aoTocarSlot(pokemon) {
    if (pokemon) {
      navigation.navigate('PokedexDetalhes', { pokemonId: pokemon.id, montando: true });
    } else {
      navigation.navigate('PokedexGeral', { escolher: true });
    }
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.topo}>
        <View style={styles.marca} />
        <View>
          <Text style={styles.titulo}>{NOME_LIVRE}</Text>
          <Text style={styles.subtitulo}>
            {lista.length}/{MAX_EQUIPE} Pokémon na equipe
          </Text>
        </View>
      </View>

      {lista.length < MAX_EQUIPE ? (
        <Text style={styles.dica}>
          {lista.length === 0
            ? 'Escolha qualquer Pokémon para montar seu time. Toque em um quadrado vazio.'
            : 'Toque em um quadrado vazio para escolher outro Pokémon.'}
        </Text>
      ) : null}

      <View style={styles.grade}>
        {slots.map((pokemon, indice) => (
          <SlotEquipe
            key={indice}
            pokemon={pokemon}
            sprite={pokemon ? fontesSprite(pokemon.id) : null}
            onPress={aoTocarSlot}
            onRemover={(p) => remover(p.id, ID_LIVRE)}
            style={styles.slot}
          />
        ))}
      </View>

      {lista.length > 0 ? (
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Tipos da equipe</Text>
          <View style={styles.linha}>
            {resumoTipos.map(([tipo, quantidade]) => (
              <View key={tipo} style={styles.tipoItem}>
                <BadgeTipo tipo={tipo} />
                <Text style={styles.quantidade}>×{quantidade}</Text>
              </View>
            ))}
          </View>
          <View style={styles.botaoDetalhes}>
            <Botao
              texto="Ver detalhes"
              variante="secundaria"
              onPress={() => navigation.navigate('Tipos', { jogo: ID_LIVRE })}
            />
          </View>
        </View>
      ) : null}

      <GraficoElite
        analise={dadosGrafico}
        titulo="Campeão de cada região"
        onSaberMais={() => navigation.navigate('EliteLivre')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: COR.fundo, flexGrow: 1 },
  topo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  marca: { width: 6, height: 44, borderRadius: 3, marginRight: 12, backgroundColor: COR.vermelho },
  titulo: { fontSize: 26, fontWeight: 'bold', color: COR.texto },
  subtitulo: { fontSize: 14, color: COR.textoSuave },
  dica: { color: COR.textoSuave, marginBottom: 14 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  slot: { width: '31.5%', marginBottom: 12 },
  secao: { backgroundColor: COR.superficie, borderRadius: 16, padding: 14, marginTop: 8 },
  secaoTitulo: { fontSize: 16, fontWeight: 'bold', color: COR.texto, marginBottom: 10 },
  linha: { flexDirection: 'row', flexWrap: 'wrap' },
  tipoItem: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  quantidade: { fontSize: 12, color: COR.textoSuave, marginBottom: 6, marginRight: 4 },
  botaoDetalhes: { marginTop: 6 },
});

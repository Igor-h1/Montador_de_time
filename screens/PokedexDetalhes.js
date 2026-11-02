// screens/PokedexDetalhes.js
// Detalhes de um Pokémon na Pokédex geral (só consulta, sem botão de equipe):
// sprite, número nacional, tipos, fraquezas e resistências e o "Saiba mais".
// Recebe pokemonId por route.params.

import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Botao from '../components/Botao';
import BadgeTipo from '../components/BadgeTipo';
import ListaFraquezas from '../components/ListaFraquezas';
import SpriteRemoto from '../components/SpriteRemoto';
import { TIPOS } from '../data/tipos';
import { COR } from '../data/tema';
import { buscarPorId, urlSaibaMais } from '../services/pokemonService';
import { fontesSprite } from '../services/spritesGeral';
import { abrirLink } from '../services/links';

export default function PokedexDetalhes({ route }) {
  const { pokemonId } = route.params;
  const pokemon = buscarPorId(pokemonId);
  const insets = useSafeAreaInsets(); // margem para os botões do Android
  const [aviso, setAviso] = useState(null);

  if (!pokemon) {
    return (
      <View style={styles.centro}>
        <Text style={styles.suave}>Pokémon #{pokemonId} não encontrado.</Text>
      </View>
    );
  }

  // Fundo do topo: cor do primeiro tipo, bem clarinha (o "33" é a transparência)
  const corTopo = TIPOS[pokemon.tipos[0]].cor + '33';

  async function aoSaberMais() {
    const resultado = await abrirLink(urlSaibaMais(pokemon));
    setAviso(resultado.ok ? null : resultado.motivo);
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <View style={[styles.topo, { backgroundColor: corTopo }]}>
        <View style={styles.circulo}>
          <SpriteRemoto fontes={fontesSprite(pokemon.id)} style={styles.sprite} />
        </View>

        <Text style={styles.numero}>Nacional #{String(pokemon.id).padStart(3, '0')}</Text>
        <Text style={styles.nome}>{pokemon.nome}</Text>
        <View style={styles.tipos}>
          {pokemon.tipos.map((tipo) => (
            <BadgeTipo key={tipo} tipo={tipo} />
          ))}
        </View>
      </View>

      <View style={styles.conteudo}>
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Fraquezas e resistências</Text>
          <ListaFraquezas tipos={pokemon.tipos} />
        </View>

        {aviso ? <Text style={styles.faixaErro}>{aviso}</Text> : null}

        <Botao texto="🌐 Saiba mais" variante="secundaria" onPress={aoSaberMais} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COR.fundo, flexGrow: 1 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  suave: { color: COR.textoSuave, textAlign: 'center' },
  topo: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  circulo: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COR.branco,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sprite: { width: 140, height: 140 },
  numero: { fontSize: 13, color: COR.textoSuave },
  nome: { fontSize: 30, fontWeight: 'bold', color: COR.texto, marginBottom: 8 },
  tipos: { flexDirection: 'row' },
  conteudo: { padding: 16 },
  secao: {
    backgroundColor: COR.superficie,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  secaoTitulo: { fontSize: 16, fontWeight: 'bold', color: COR.texto, marginBottom: 10 },
  faixaErro: {
    backgroundColor: '#F8D7DA',
    color: '#842029',
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
});

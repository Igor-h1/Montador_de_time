// screens/Detalhes.js
// Recebe pokemonId e jogo por route.params.
// Mostra sprite, tipos, fraquezas, botão "Adicionar ao time" (com validações
// do EquipeContext) e o botão "Saiba mais" (único que precisa de internet).

import React, { useState } from 'react';
import { ScrollView, View, Text, Image, Linking, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Botao from '../components/Botao';
import BadgeTipo from '../components/BadgeTipo';
import ListaFraquezas from '../components/ListaFraquezas';
import { JOGOS } from '../data/jogos';
import {
  buscarPorId,
  obterSprite,
  estaDisponivel,
  urlSaibaMais,
} from '../services/pokemonService';
import { useEquipe } from '../context/EquipeContext';

export default function Detalhes({ route }) {
  const { pokemonId, jogo: jogoId } = route.params;
  const jogo = JOGOS[jogoId];
  const pokemon = buscarPorId(pokemonId);
  const sprite = obterSprite(pokemonId, jogoId);

  const { adicionar } = useEquipe();
  // aviso = { tipo: 'ok' | 'erro', texto: '...' } ou null
  const [aviso, setAviso] = useState(null);

  if (!pokemon) {
    return (
      <View style={styles.centro}>
        <Text>Pokémon #{pokemonId} não encontrado.</Text>
      </View>
    );
  }

  const disponivel = estaDisponivel(pokemon.id, jogoId);

  function aoAdicionar() {
    const resultado = adicionar(pokemon.id, jogoId);
    setAviso(
      resultado.ok
        ? { tipo: 'ok', texto: `${pokemon.nome} foi adicionado ao time!` }
        : { tipo: 'erro', texto: resultado.motivo }
    );
  }

  async function aoSaberMais() {
    try {
      const rede = await NetInfo.fetch();
      // isInternetReachable pode ser null (ainda não sabe): nesse caso tentamos abrir
      if (rede.isConnected === false || rede.isInternetReachable === false) {
        setAviso({ tipo: 'erro', texto: 'Sem internet. Conecte-se para ver mais detalhes.' });
        return;
      }
      await Linking.openURL(urlSaibaMais(pokemon));
    } catch (erro) {
      setAviso({ tipo: 'erro', texto: 'Não foi possível abrir o site.' });
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!disponivel ? (
        <Text style={[styles.faixa, styles.erro]}>🔒 Não disponível no {jogo.nome}</Text>
      ) : null}

      <View style={styles.topo}>
        {sprite ? (
          <Image source={sprite} style={styles.sprite} resizeMode="contain" />
        ) : (
          <Text style={styles.interrogacao}>?</Text>
        )}
        <Text style={styles.numero}>#{String(pokemon.id).padStart(3, '0')}</Text>
        <Text style={styles.nome}>{pokemon.nome}</Text>
        <View style={styles.tipos}>
          {pokemon.tipos.map((tipo) => (
            <BadgeTipo key={tipo} tipo={tipo} />
          ))}
        </View>
      </View>

      <View style={styles.secao}>
        <Text style={styles.titulo}>Fraquezas e resistências</Text>
        <ListaFraquezas tipos={pokemon.tipos} />
      </View>

      <Botao texto="Adicionar ao time" cor={jogo.cor} onPress={aoAdicionar} />
      <Botao texto="🌐 Saiba mais" variante="secundaria" onPress={aoSaberMais} />

      {aviso ? (
        <Text style={[styles.faixa, aviso.tipo === 'ok' ? styles.ok : styles.erro]}>
          {aviso.texto}
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f2f2f2', flexGrow: 1 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topo: { alignItems: 'center', marginBottom: 16 },
  sprite: { width: 160, height: 160 },
  interrogacao: { fontSize: 64, color: '#aaa', fontWeight: 'bold' },
  numero: { fontSize: 13, color: '#888', marginTop: 4 },
  nome: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  tipos: { flexDirection: 'row' },
  secao: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 16 },
  titulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  faixa: { padding: 10, borderRadius: 8, textAlign: 'center', marginBottom: 12 },
  ok: { backgroundColor: '#d1e7dd', color: '#0f5132' },
  erro: { backgroundColor: '#f8d7da', color: '#842029' },
});

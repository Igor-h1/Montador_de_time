// screens/Detalhes.js  (PROVISÓRIA - a tela completa vem na Etapa 5)
// Recebe pokemonId e jogo por route.params e testa o botão
// "Adicionar ao time" com as validações do EquipeContext.

import React, { useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import Botao from '../components/Botao';
import BadgeTipo from '../components/BadgeTipo';
import { JOGOS } from '../data/jogos';
import { buscarPorId, obterSprite } from '../services/pokemonService';
import { useEquipe } from '../context/EquipeContext';

export default function Detalhes({ route }) {
  const { pokemonId, jogo: jogoId } = route.params;
  const jogo = JOGOS[jogoId];
  const pokemon = buscarPorId(pokemonId);
  const sprite = obterSprite(pokemonId, jogoId);

  const { adicionar } = useEquipe();
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState(false);

  if (!pokemon) {
    return (
      <View style={styles.container}>
        <Text>Pokémon #{pokemonId} não encontrado.</Text>
      </View>
    );
  }

  function aoAdicionar() {
    const resultado = adicionar(pokemon.id, jogoId);
    setSucesso(resultado.ok);
    setMensagem(resultado.ok ? `${pokemon.nome} foi adicionado ao time!` : resultado.motivo);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.nome}>
        #{pokemon.id} {pokemon.nome}
      </Text>
      <Text style={styles.jogo}>Jogo: {jogo.nome}</Text>

      {sprite ? <Image source={sprite} style={styles.sprite} resizeMode="contain" /> : null}

      <View style={styles.tipos}>
        {pokemon.tipos.map((tipo) => (
          <BadgeTipo key={tipo} tipo={tipo} />
        ))}
      </View>

      <Botao texto="Adicionar ao time" cor={jogo.cor} onPress={aoAdicionar} />

      {mensagem ? (
        <Text style={[styles.mensagem, sucesso ? styles.ok : styles.erro]}>{mensagem}</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f2f2f2', alignItems: 'center', flexGrow: 1 },
  nome: { fontSize: 24, fontWeight: 'bold' },
  jogo: { color: '#666', marginBottom: 8 },
  sprite: { width: 160, height: 160 },
  tipos: { flexDirection: 'row', marginBottom: 16 },
  mensagem: { marginTop: 8, padding: 10, borderRadius: 8, textAlign: 'center', alignSelf: 'stretch' },
  ok: { backgroundColor: '#d1e7dd', color: '#0f5132' },
  erro: { backgroundColor: '#f8d7da', color: '#842029' },
});

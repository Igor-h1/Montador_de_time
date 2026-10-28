// screens/Pokedex.js  (PROVISÓRIA - a grade real vem na Etapa 4)
// Por enquanto só prova que o jogo chega por route.params e que dá para
// navegar para os Detalhes enviando pokemonId e jogo.

import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import Cabecalho from '../components/Cabecalho';
import Botao from '../components/Botao';
import { JOGOS } from '../data/jogos';
import { buscarPorId, estaDisponivel, listarDisponiveis } from '../services/pokemonService';

// 1 Bulbasaur, 6 Charizard, 25 Pikachu, 35 Clefairy, 94 Gengar,
// 143 Snorlax, 150 Mewtwo, 252 Treecko
const IDS_TESTE = [1, 6, 25, 35, 94, 143, 150, 252];

export default function Pokedex({ navigation, route }) {
  const jogoId = route.params.jogo;
  const jogo = JOGOS[jogoId];
  const total = listarDisponiveis(jogoId).length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Cabecalho
        titulo={`Pokédex ${jogo.nome}`}
        subtitulo={`${total} Pokémon disponíveis`}
        cor={jogo.cor}
      />

      <Text style={styles.aviso}>
        Tela provisória. Toque para abrir os Detalhes (envia pokemonId e jogo).
        Aqui os bloqueados também abrem, só para testar as validações.
      </Text>

      {IDS_TESTE.map((id) => {
        const pokemon = buscarPorId(id);
        const bloqueado = !estaDisponivel(id, jogoId);
        return (
          <Botao
            key={id}
            texto={`${pokemon.nome}${bloqueado ? ' 🔒' : ''}`}
            variante="secundaria"
            onPress={() => navigation.navigate('Detalhes', { pokemonId: id, jogo: jogoId })}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f2f2f2' },
  aviso: { color: '#664d03', backgroundColor: '#fff3cd', padding: 10, borderRadius: 8, marginBottom: 12 },
});

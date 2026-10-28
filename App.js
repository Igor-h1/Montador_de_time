// App.js
// Navegação (Stack) + Provider da equipe envolvendo o app inteiro.

import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EquipeProvider } from './context/EquipeContext';
import { JOGOS } from './data/jogos';
import Home from './screens/Home';
import Pokedex from './screens/Pokedex';
import Detalhes from './screens/Detalhes';
import Equipe from './screens/Equipe';

const Stack = createNativeStackNavigator();

// Opções do header das telas que recebem { jogo } em route.params:
// cor e título do jogo e, opcionalmente, o botão "Equipe" à direita.
function criarOpcoes(prefixo, mostrarBotaoEquipe) {
  return ({ navigation, route }) => {
    const jogo = JOGOS[route.params.jogo];
    return {
      title: `${prefixo} ${jogo.nome}`,
      headerStyle: { backgroundColor: jogo.cor },
      headerTintColor: '#fff',
      headerRight: mostrarBotaoEquipe
        ? () => (
            <Pressable
              hitSlop={8}
              onPress={() => navigation.navigate('Equipe', { jogo: route.params.jogo })}
            >
              <Text style={styles.botaoHeader}>👥 Equipe</Text>
            </Pressable>
          )
        : undefined,
    };
  };
}

export default function App() {
  return (
    <EquipeProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={{ title: 'Início' }} />
          <Stack.Screen name="Pokedex" component={Pokedex} options={criarOpcoes('Pokédex', true)} />
          <Stack.Screen name="Detalhes" component={Detalhes} options={criarOpcoes('Detalhes', true)} />
          <Stack.Screen name="Equipe" component={Equipe} options={criarOpcoes('Equipe', false)} />
        </Stack.Navigator>
      </NavigationContainer>
    </EquipeProvider>
  );
}

const styles = StyleSheet.create({
  botaoHeader: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

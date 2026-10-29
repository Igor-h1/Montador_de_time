// App.js
// Navegação (Stack) + Provider da equipe envolvendo o app inteiro.
// Fluxo: Home -> Equipe -> Pokédex -> Detalhes

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EquipeProvider } from './context/EquipeContext';
import { JOGOS } from './data/jogos';
import { COR } from './data/tema';
import { buscarPorId } from './services/pokemonService';
import Home from './screens/Home';
import Equipe from './screens/Equipe';
import Pokedex from './screens/Pokedex';
import Detalhes from './screens/Detalhes';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <EquipeProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: COR.vermelho },
              headerTintColor: COR.branco,
              headerTitleStyle: { fontWeight: '700' },
              contentStyle: { backgroundColor: COR.fundo },
            }}
          >
            {/* A Home usa o Cabecalho próprio no lugar do header */}
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen
              name="Equipe"
              component={Equipe}
              options={({ route }) => ({ title: `Equipe ${JOGOS[route.params.jogo].nome}` })}
            />
            <Stack.Screen
              name="Pokedex"
              component={Pokedex}
              options={{ title: 'Escolher Pokémon' }}
            />
            <Stack.Screen
              name="Detalhes"
              component={Detalhes}
              options={({ route }) => {
                const pokemon = buscarPorId(route.params.pokemonId);
                return { title: pokemon ? pokemon.nome : 'Detalhes' };
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </EquipeProvider>
    </SafeAreaProvider>
  );
}

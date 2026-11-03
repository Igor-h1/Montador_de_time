// App.js
// Navegação (Stack) + Provider da equipe envolvendo o app inteiro.
// Fluxo: Menu -> Montar time (escolher o jogo) -> Equipe -> Pokédex -> Detalhes

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EquipeProvider } from './context/EquipeContext';
import { JOGOS } from './data/jogos';
import { COR } from './data/tema';
import { buscarPorId } from './services/pokemonService';
import Menu from './screens/Menu';
import Home from './screens/Home';
import Equipe from './screens/Equipe';
import Pokedex from './screens/Pokedex';
import Detalhes from './screens/Detalhes';
import Elite from './screens/Elite';
import Tipos from './screens/Tipos';
import PokedexGeral from './screens/PokedexGeral';
import PokedexDetalhes from './screens/PokedexDetalhes';
import EquipeLivre from './screens/EquipeLivre';
import EliteLivre from './screens/EliteLivre';
import EliteLivreCompleta from './screens/EliteLivreCompleta';
import { NOME_LIVRE } from './data/livre';
import { obterElite } from './services/eliteService';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <EquipeProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator
            initialRouteName="Menu"
            screenOptions={{
              headerStyle: { backgroundColor: COR.vermelho },
              headerTintColor: COR.branco,
              headerTitleStyle: { fontWeight: '700' },
              contentStyle: { backgroundColor: COR.fundo },
            }}
          >
            {/* O Menu é o aparelho em forma de Pokédex: não usa o header */}
            <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
            <Stack.Screen name="MontarTime" component={Home} options={{ title: 'Escolher jogo' }} />
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
            <Stack.Screen
              name="PokedexGeral"
              component={PokedexGeral}
              options={({ route }) => ({
                title: route.params && route.params.escolher ? 'Escolher Pokémon' : 'Pokédex',
              })}
            />
            <Stack.Screen
              name="PokedexDetalhes"
              component={PokedexDetalhes}
              options={({ route }) => {
                const pokemon = buscarPorId(route.params.pokemonId);
                return { title: pokemon ? pokemon.nome : 'Pokémon' };
              }}
            />
            <Stack.Screen name="EquipeLivre" component={EquipeLivre} options={{ title: NOME_LIVRE }} />
            <Stack.Screen
              name="EliteLivre"
              component={EliteLivre}
              options={{ title: 'Campeões das regiões' }}
            />
            <Stack.Screen
              name="EliteLivreCompleta"
              component={EliteLivreCompleta}
              options={{ title: 'Elite dos 4 e pós-game' }}
            />
            <Stack.Screen
              name="Tipos"
              component={Tipos}
              options={{ title: 'Tipos da equipe' }}
            />
            <Stack.Screen
              name="Elite"
              component={Elite}
              options={({ route }) => {
                const elite = obterElite(route.params.jogo);
                return { title: elite ? `Elite dos 4 · ${elite.regiao}` : 'Elite dos 4' };
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </EquipeProvider>
    </SafeAreaProvider>
  );
}

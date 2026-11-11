// screens/PokedexDetalhes.js
// Detalhes de um Pokémon na Pokédex geral (só consulta, sem botão de equipe):
// sprite, número nacional, tipos, fraquezas e resistências e o "Saiba mais".
// Recebe pokemonId por route.params. Com route.params.montando (vindo do ambiente livre)
// mostra também o botão de adicionar/remover da equipe livre.

import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Botao from '../components/Botao';
import BadgeTipo from '../components/BadgeTipo';
import ListaFraquezas from '../components/ListaFraquezas';
import StatusBase from '../components/StatusBase';
import Evolucao from '../components/Evolucao';
import BotaoShiny from '../components/BotaoShiny';
import SpriteRemoto from '../components/SpriteRemoto';
import { TIPOS } from '../data/tipos';
import { COR } from '../data/tema';
import { buscarPorId, urlSaibaMais } from '../services/pokemonService';
import { fontesSprite, fontesSpriteShiny } from '../services/spritesGeral';
import useRede from '../services/useRede';
import { obterEvolucao, temDadosEvolucao } from '../services/evolucoes';
import { abrirLink } from '../services/links';
import { nomeSomTipo } from '../services/sons';
import { useEquipe } from '../context/EquipeContext';
import { ID_LIVRE } from '../data/livre';

export default function PokedexDetalhes({ navigation, route }) {
  const { pokemonId } = route.params;
  const pokemon = buscarPorId(pokemonId);
  const insets = useSafeAreaInsets(); // margem para os botões do Android
  const [aviso, setAviso] = useState(null);
  const { equipe, adicionar, remover } = useEquipe();
  const montando = Boolean(route.params.montando); // veio do ambiente livre
  // Shiny: só existe na internet. Ao perder a conexão, volta ao sprite normal.
  const online = useRede();
  const [shiny, setShiny] = useState(false);
  useEffect(() => {
    if (online === false) setShiny(false);
  }, [online]);

  if (!pokemon) {
    return (
      <View style={styles.centro}>
        <Text style={styles.suave}>Pokémon #{pokemonId} não encontrado.</Text>
      </View>
    );
  }

  // Fundo do topo: cor do primeiro tipo, bem clarinha (o "33" é a transparência)
  const corTopo = TIPOS[pokemon.tipos[0]].cor + '33';
  const jaNoTime = equipe[ID_LIVRE].includes(pokemon.id);
  // Evolução (a Pokédex geral conhece os 649). Sem os dados gerados, não mostra o cartão.
  const evolucao = temDadosEvolucao() ? obterEvolucao(pokemon.id) : null;

  // Abre outro Pokémon. Vindo do ambiente livre (montando), troca a tela no lugar (replace),
  // para o botão de adicionar continuar voltando direto para a equipe. Na consulta, empilha
  // (push), e o botão de voltar leva ao Pokémon anterior.
  function abrirPokemon(outro) {
    const params = { pokemonId: outro.id, montando };
    if (montando) navigation.replace('PokedexDetalhes', params);
    else navigation.push('PokedexDetalhes', params);
  }

  function aoFalharShiny() {
    setShiny(false);
    setAviso('Não foi possível carregar o shiny.');
  }

  function aoAdicionar() {
    const resultado = adicionar(pokemon.id, ID_LIVRE);
    if (resultado.ok) {
      // Equipe livre -> Pokédex -> Detalhes: volta 2 telas, para a equipe
      navigation.pop(2);
    } else {
      setAviso(resultado.motivo);
    }
  }

  function aoRemover() {
    remover(pokemon.id, ID_LIVRE);
    navigation.goBack();
  }

  async function aoSaberMais() {
    const resultado = await abrirLink(urlSaibaMais(pokemon));
    setAviso(resultado.ok ? null : resultado.motivo);
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <View style={[styles.topo, { backgroundColor: corTopo }]}>
        <View style={styles.circulo}>
          <SpriteRemoto
            fontes={shiny ? fontesSpriteShiny(pokemon.id) : fontesSprite(pokemon.id)}
            style={styles.sprite}
            onFalha={aoFalharShiny}
          />
        </View>

        <Text style={styles.numero}>Nacional #{String(pokemon.id).padStart(3, '0')}</Text>
        <Text style={styles.nome}>{pokemon.nome}</Text>
        <View style={styles.tipos}>
          {pokemon.tipos.map((tipo) => (
            <BadgeTipo key={tipo} tipo={tipo} />
          ))}
        </View>
        <BotaoShiny ativo={shiny} desabilitado={online === false} onPress={() => setShiny(!shiny)} />
      </View>

      <View style={styles.conteudo}>
        <StatusBase stats={pokemon.stats} />

        <Evolucao
          dados={evolucao}
          onAbrir={abrirPokemon}
          fontesDe={(outro) => fontesSprite(outro.id)}
        />

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Fraquezas e resistências</Text>
          <ListaFraquezas tipos={pokemon.tipos} />
        </View>

        {montando ? (
          jaNoTime ? (
            <Botao texto="Remover do time" variante="perigo" onPress={aoRemover} />
          ) : (
            <Botao texto="Adicionar ao time" som={nomeSomTipo(pokemon)} onPress={aoAdicionar} />
          )
        ) : null}

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

// screens/Detalhes.js
// Recebe pokemonId e jogo por route.params.
// Mostra sprite, tipos e fraquezas, o botão de adicionar (ou remover) do time
// e, por último, o "Saiba mais" (único que precisa de internet).
//
// Fluxo: Equipe -> Pokédex -> Detalhes. Ao adicionar com sucesso, volta direto
// para a Equipe (navigation.pop(2)).

import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Botao from '../components/Botao';
import BadgeTipo from '../components/BadgeTipo';
import ListaFraquezas from '../components/ListaFraquezas';
import StatusBase from '../components/StatusBase';
import Evolucao from '../components/Evolucao';
import BotaoShiny from '../components/BotaoShiny';
import SpriteRemoto from '../components/SpriteRemoto';
import { JOGOS } from '../data/jogos';
import { TIPOS } from '../data/tipos';
import { COR } from '../data/tema';
import {
  buscarPorId,
  obterSprite,
  estaDisponivel,
  numeroRegionalDe,
  urlSaibaMais,
} from '../services/pokemonService';
import { fontesShiny } from '../services/shiny';
import useRede from '../services/useRede';
import { obterEvolucao, temDadosEvolucao } from '../services/evolucoes';
import { abrirLink } from '../services/links';
import { useEquipe } from '../context/EquipeContext';

const formatarNumero = (numero) => '#' + String(numero).padStart(3, '0');

export default function Detalhes({ navigation, route }) {
  const { pokemonId, jogo: jogoId } = route.params;
  const jogo = JOGOS[jogoId];
  const pokemon = buscarPorId(pokemonId);
  const sprite = obterSprite(pokemonId, jogoId);

  const { equipe, adicionar, remover } = useEquipe();
  // Margem inferior para o conteúdo não ficar atrás dos botões do Android
  const insets = useSafeAreaInsets();
  const [erroImagem, setErroImagem] = useState(false);
  // aviso = { tipo: 'ok' | 'erro', texto: '...' } ou null
  const [aviso, setAviso] = useState(null);
  // Shiny: só existe na internet. Ao perder a conexão, volta ao sprite normal.
  const online = useRede();
  const [shiny, setShiny] = useState(false);
  useEffect(() => {
    if (online === false) setShiny(false);
  }, [online]);

  if (!pokemon) {
    return (
      <View style={styles.centro}>
        <Text>Pokémon #{pokemonId} não encontrado.</Text>
      </View>
    );
  }

  const disponivel = estaDisponivel(pokemon.id, jogoId);
  const numeroRegional = numeroRegionalDe(pokemon.id, jogoId);
  // Evolução, só com o que existe neste jogo (até o maxId). Sem os dados gerados, não mostra o cartão.
  const evolucao = temDadosEvolucao() ? obterEvolucao(pokemon.id, jogo.maxId) : null;
  const jaNoTime = equipe[jogoId].includes(pokemon.id);
  const mostrarImagem = sprite && !erroImagem;
  // Fundo do topo: cor do primeiro tipo, bem clarinha (o "33" é a transparência)
  const corTopo = TIPOS[pokemon.tipos[0]].cor + '33';

  // Troca o Pokémon da tela. O replace mantém a mesma profundidade da pilha, então o botão
  // de adicionar continua voltando direto para a Equipe.
  function abrirPokemon(outro) {
    navigation.replace('Detalhes', { pokemonId: outro.id, jogo: jogoId });
  }

  // Sprite dos Pokémon da evolução: o do jogo da tela
  function fontesDoJogo(outro) {
    const sprite = obterSprite(outro.id, jogoId);
    return sprite ? [sprite] : [];
  }

  function aoFalharShiny() {
    setShiny(false);
    setAviso({ tipo: 'erro', texto: 'Não foi possível carregar o shiny.' });
  }

  function aoAdicionar() {
    const resultado = adicionar(pokemon.id, jogoId);
    if (resultado.ok) {
      // Estamos em Equipe -> Pokédex -> Detalhes: volta 2 telas, para a Equipe
      navigation.pop(2);
    } else {
      setAviso({ tipo: 'erro', texto: resultado.motivo });
    }
  }

  function aoRemover() {
    remover(pokemon.id, jogoId);
    navigation.goBack();
  }

  async function aoSaberMais() {
    const resultado = await abrirLink(urlSaibaMais(pokemon));
    if (!resultado.ok) setAviso({ tipo: 'erro', texto: resultado.motivo });
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <View style={[styles.topo, { backgroundColor: corTopo }]}>
        <View style={styles.circulo}>
          {shiny ? (
            <SpriteRemoto
              fontes={fontesShiny(pokemon.id, jogoId)}
              style={styles.sprite}
              onFalha={aoFalharShiny}
            />
          ) : mostrarImagem ? (
            <Image
              source={sprite}
              style={styles.sprite}
              resizeMode="contain"
              onError={() => setErroImagem(true)}
            />
          ) : (
            <Text style={styles.interrogacao}>?</Text>
          )}
        </View>

        <Text style={styles.numero}>
          {numeroRegional
            ? `${formatarNumero(numeroRegional)} · Nacional ${formatarNumero(pokemon.id)}`
            : `Nacional ${formatarNumero(pokemon.id)}`}
        </Text>
        <Text style={styles.nome}>{pokemon.nome}</Text>
        <View style={styles.tipos}>
          {pokemon.tipos.map((tipo) => (
            <BadgeTipo key={tipo} tipo={tipo} />
          ))}
        </View>
        <Text style={styles.jogo}>{jogo.nome}</Text>
        <BotaoShiny ativo={shiny} desabilitado={online === false} onPress={() => setShiny(!shiny)} />
      </View>

      <View style={styles.conteudo}>
        {!disponivel ? (
          <Text style={[styles.faixa, styles.erro]}>🔒 Não disponível no {jogo.nome}</Text>
        ) : null}

        <StatusBase stats={pokemon.stats} />

        <Evolucao
          dados={evolucao}
          onAbrir={abrirPokemon}
          fontesDe={fontesDoJogo}
          bloqueado={(outro) => !estaDisponivel(outro.id, jogoId)}
        />

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Fraquezas e resistências</Text>
          <ListaFraquezas tipos={pokemon.tipos} />
        </View>

        {jaNoTime ? (
          <Botao texto="Remover do time" variante="perigo" onPress={aoRemover} />
        ) : (
          <Botao texto="Adicionar ao time" desabilitado={!disponivel} onPress={aoAdicionar} />
        )}

        {aviso ? (
          <Text style={[styles.faixa, aviso.tipo === 'ok' ? styles.ok : styles.erro]}>
            {aviso.texto}
          </Text>
        ) : null}

        <Botao texto="🌐 Saiba mais" variante="secundaria" onPress={aoSaberMais} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COR.fundo, flexGrow: 1 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
  interrogacao: { fontSize: 64, color: '#B0B5BD', fontWeight: 'bold' },
  numero: { fontSize: 13, color: COR.textoSuave },
  nome: { fontSize: 30, fontWeight: 'bold', color: COR.texto, marginBottom: 8 },
  tipos: { flexDirection: 'row' },
  jogo: { fontSize: 12, color: COR.textoSuave, marginTop: 4 },
  conteudo: { padding: 16 },
  secao: {
    backgroundColor: COR.superficie,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  secaoTitulo: { fontSize: 16, fontWeight: 'bold', color: COR.texto, marginBottom: 10 },
  faixa: { padding: 10, borderRadius: 10, textAlign: 'center', marginBottom: 12, overflow: 'hidden' },
  ok: { backgroundColor: '#D1E7DD', color: '#0F5132' },
  erro: { backgroundColor: '#F8D7DA', color: '#842029' },
});

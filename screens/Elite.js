// screens/Elite.js
// "Saiba mais" do gráfico da Equipe: mostra onde a equipe tem mais dificuldade e
// os times da Elite dos 4 (e campeão) da região, com um "Saiba mais" (Bulbapedia)
// em cada Pokémon. Jogo vem por route.params ({ jogo }).

import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BadgeTipo from '../components/BadgeTipo';
import Medidor from '../components/Medidor';
import SeloNivel from '../components/SeloNivel';
import EtiquetaTreinador from '../components/EtiquetaTreinador';
import { COR } from '../data/tema';
import { analisarElite } from '../services/eliteService';
import { buscarPorNome, obterSprite } from '../services/pokemonService';
import { abrirLink, urlWiki } from '../services/links';
import { useEquipe } from '../context/EquipeContext';

const CATEGORIAS = { elite4: 'Elite dos 4', campeao: 'Campeão', posgame: 'Pós-game' };

function SpritePokemon({ sprite }) {
  const [erro, setErro] = useState(false);
  return (
    <View style={styles.spriteBox}>
      {sprite && !erro ? (
        <Image
          source={sprite}
          style={styles.sprite}
          resizeMode="contain"
          onError={() => setErro(true)}
        />
      ) : (
        <Text style={styles.interrogacao}>?</Text>
      )}
    </View>
  );
}

// Texto e cor do confronto de um Pokémon do treinador contra a sua equipe
function textoConfronto(pokemon) {
  if (!pokemon.melhor) return null;
  if (pokemon.sentido === 'vantagem') {
    return { texto: `▲ Vantagem com ${pokemon.melhor}`, cor: '#1F9D3A' };
  }
  if (pokemon.sentido === 'desvantagem') {
    return { texto: `▼ Desvantagem (melhor: ${pokemon.melhor})`, cor: '#B3001B' };
  }
  return { texto: `● Neutro (melhor: ${pokemon.melhor})`, cor: COR.textoSuave };
}

function LinhaPokemon({ pokemon, jogoId, onWiki }) {
  // Procura o Pokémon no índice só para achar o sprite
  const base = buscarPorNome(pokemon.nome);
  const sprite = base ? obterSprite(base.id, jogoId) : null;
  const confronto = textoConfronto(pokemon);

  return (
    <View style={styles.linhaPokemon}>
      <SpritePokemon sprite={sprite} />

      <View style={styles.infoPokemon}>
        <Text style={styles.nomePokemon}>{pokemon.nome}</Text>
        <View style={styles.tipos}>
          {pokemon.tipos.map((tipo) => (
            <BadgeTipo key={tipo} tipo={tipo} pequeno />
          ))}
        </View>
        {confronto ? (
          <Text style={[styles.confronto, { color: confronto.cor }]} numberOfLines={2}>
            {confronto.texto}
          </Text>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`Saiba mais sobre ${pokemon.nome}`}
        onPress={() => onWiki(pokemon.nome)}
        style={({ pressed }) => [styles.link, pressed && styles.pressionado]}
      >
        <Text style={styles.linkTexto}>Saiba mais</Text>
      </Pressable>
    </View>
  );
}

function CartaoTreinador({ treinador, temEquipe, jogoId, maisDificil, onWiki }) {
  return (
    <View style={styles.cartao}>
      <View style={styles.cabecaTreinador}>
        <View style={styles.esquerda}>
          <Text style={styles.categoria}>{CATEGORIAS[treinador.categoria]}</Text>
          <View style={styles.nomeLinha}>
            <Text style={styles.nomeTreinador}>{treinador.nome}</Text>
            <View style={styles.etiqueta}>
              <EtiquetaTreinador treinador={treinador} />
            </View>
          </View>
        </View>
        {temEquipe ? <Medidor quadrados={treinador.quadrados} sentido={treinador.sentido} /> : null}
      </View>

      {maisDificil ? <Text style={styles.maisDificil}>⚠️ Um dos mais difíceis para a sua equipe</Text> : null}
      {treinador.nota ? <Text style={styles.nota}>{treinador.nota}</Text> : null}

      {treinador.pokemons.map((pokemon, indice) => (
        <LinhaPokemon
          key={`${treinador.id}-${indice}`}
          pokemon={pokemon}
          jogoId={jogoId}
          onWiki={onWiki}
        />
      ))}
    </View>
  );
}

export default function Elite({ route }) {
  const jogoId = route.params.jogo;
  const insets = useSafeAreaInsets();
  const { pokemonsDaEquipe } = useEquipe();
  const [aviso, setAviso] = useState(null);

  const equipe = useMemo(() => pokemonsDaEquipe(jogoId), [pokemonsDaEquipe, jogoId]);
  const analise = useMemo(() => analisarElite(jogoId, equipe), [jogoId, equipe]);

  async function aoAbrirWiki(nome) {
    const resultado = await abrirLink(urlWiki(nome));
    setAviso(resultado.ok ? null : resultado.motivo);
  }

  if (!analise) {
    return (
      <View style={styles.centro}>
        <Text style={styles.suave}>Este jogo ainda não tem dados da Elite dos 4.</Text>
      </View>
    );
  }

  const idsMaisDificeis = analise.maisDificeis.map((t) => t.id);

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.resumo}>
        <Text style={styles.resumoTitulo}>Resumo para a sua equipe</Text>

        {analise.temEquipe ? (
          <>
            <View style={styles.resumoLinha}>
              <Text style={styles.resumoRotulo}>Dificuldade estimada</Text>
              <SeloNivel nivel={analise.dificuldade} />
            </View>
            <Text style={styles.resumoTexto}>
              {analise.maisDificeis.length > 0
                ? `Mais difícil contra: ${analise.maisDificeis.map((t) => t.nome).join(', ')}.`
                : 'Nenhum treinador deixa a sua equipe em desvantagem pelos tipos.'}
            </Text>
          </>
        ) : (
          <Text style={styles.resumoTexto}>
            Adicione Pokémon à equipe para ver como ela se sai. Enquanto isso, você pode
            conhecer os times abaixo.
          </Text>
        )}

        <Text style={styles.aviso}>
          Estimativa só pelos tipos: não considera nível, golpes, habilidades nem itens.
        </Text>
      </View>

      {aviso ? <Text style={styles.faixaErro}>{aviso}</Text> : null}

      <Text style={styles.secao}>Elite dos 4 · {analise.regiao}</Text>
      {analise.principais.map((treinador) => (
        <CartaoTreinador
          key={treinador.id}
          treinador={treinador}
          temEquipe={analise.temEquipe}
          jogoId={jogoId}
          maisDificil={idsMaisDificeis.includes(treinador.id)}
          onWiki={aoAbrirWiki}
        />
      ))}

      {analise.posgame.length > 0 ? (
        <>
          <Text style={styles.secao}>Pós-game</Text>
          {analise.posgame.map((treinador) => (
            <CartaoTreinador
              key={treinador.id}
              treinador={treinador}
              temEquipe={analise.temEquipe}
              jogoId={jogoId}
              maisDificil={false}
              onWiki={aoAbrirWiki}
            />
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: COR.fundo, flexGrow: 1 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  suave: { color: COR.textoSuave, textAlign: 'center' },

  resumo: { backgroundColor: COR.superficie, borderRadius: 16, padding: 14, marginBottom: 8 },
  resumoTitulo: { fontSize: 16, fontWeight: 'bold', color: COR.texto, marginBottom: 10 },
  resumoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resumoRotulo: { fontSize: 15, fontWeight: '600', color: COR.texto },
  resumoTexto: { color: COR.texto, marginBottom: 8 },
  aviso: { fontSize: 11, color: COR.textoSuave },
  faixaErro: {
    backgroundColor: '#F8D7DA',
    color: '#842029',
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    marginVertical: 8,
    overflow: 'hidden',
  },

  secao: { fontSize: 18, fontWeight: 'bold', color: COR.texto, marginTop: 16, marginBottom: 8 },
  cartao: {
    backgroundColor: COR.branco,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COR.borda,
    padding: 12,
    marginBottom: 12,
  },
  cabecaTreinador: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  esquerda: { flex: 1, marginRight: 10 },
  categoria: { fontSize: 11, color: COR.textoSuave, fontWeight: '600' },
  nomeLinha: { flexDirection: 'row', alignItems: 'center' },
  nomeTreinador: { fontSize: 18, fontWeight: 'bold', color: COR.texto, flexShrink: 1 },
  etiqueta: { marginLeft: 8, marginBottom: -4 },
  maisDificil: { color: '#B3001B', fontWeight: '600', fontSize: 12, marginBottom: 6 },
  nota: { color: COR.textoSuave, fontSize: 12, fontStyle: 'italic', marginBottom: 6 },

  linhaPokemon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COR.borda,
  },
  spriteBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: COR.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sprite: { width: 44, height: 44 },
  interrogacao: { fontSize: 22, color: '#B0B5BD', fontWeight: 'bold' },
  infoPokemon: { flex: 1 },
  nomePokemon: { fontSize: 15, fontWeight: '700', color: COR.texto },
  tipos: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 },
  confronto: { fontSize: 11, fontWeight: '600' },
  link: {
    borderWidth: 1.5,
    borderColor: COR.vermelho,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
  },
  linkTexto: { color: COR.vermelho, fontSize: 12, fontWeight: '700' },
  pressionado: { opacity: 0.7 },
});

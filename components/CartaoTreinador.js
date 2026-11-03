// components/CartaoTreinador.js
// Cartão de um treinador da Elite dos 4 (ou campeão): nome, tipo, medidor contra a
// equipe e o time dele, com o confronto de cada Pokémon e um "Saiba mais" (Bulbapedia).
// Usado pela tela Elite (um jogo) e pela EliteLivre (todas as regiões).
// Props:
//   treinador    treinador já analisado (vem de analisarElite / analisarEliteLivre)
//   temEquipe    se há Pokémon na equipe (sem equipe, não mostra medidor nem confrontos)
//   maisDificil  destaca o treinador como um dos mais difíceis
//   onWiki       chamado com o nome do Pokémon ao tocar em "Saiba mais"
//   fontesDe     função: nome do Pokémon -> lista de fontes de sprite (ver SpriteRemoto)

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import BadgeTipo from './BadgeTipo';
import Medidor from './Medidor';
import EtiquetaTreinador from './EtiquetaTreinador';
import SpriteRemoto from './SpriteRemoto';
import { COR } from '../data/tema';

const CATEGORIAS = { elite4: 'Elite dos 4', campeao: 'Campeão', posgame: 'Pós-game' };

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

function LinhaPokemon({ pokemon, onWiki, fontesDe }) {
  const confronto = textoConfronto(pokemon);

  return (
    <View style={styles.linhaPokemon}>
      <View style={styles.spriteBox}>
        <SpriteRemoto fontes={fontesDe(pokemon.nome)} style={styles.sprite} />
      </View>

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

export default function CartaoTreinador({ treinador, temEquipe, maisDificil, onWiki, fontesDe }) {
  return (
    <View style={styles.cartao}>
      <View style={styles.cabecaTreinador}>
        <View style={styles.esquerda}>
          <Text style={styles.categoria} numberOfLines={1}>
            {treinador.subtitulo
              ? `${CATEGORIAS[treinador.categoria]} · ${treinador.subtitulo}`
              : CATEGORIAS[treinador.categoria]}
          </Text>
          <View style={styles.nomeLinha}>
            <Text style={styles.nomeTreinador}>{treinador.nome}</Text>
            <View style={styles.etiqueta}>
              <EtiquetaTreinador treinador={treinador} />
            </View>
          </View>
        </View>
        {temEquipe ? <Medidor quadrados={treinador.quadrados} sentido={treinador.sentido} /> : null}
      </View>

      {maisDificil ? (
        <Text style={styles.maisDificil}>⚠️ Um dos mais difíceis para a sua equipe</Text>
      ) : null}
      {treinador.nota ? <Text style={styles.nota}>{treinador.nota}</Text> : null}

      {treinador.pokemons.map((pokemon, indice) => (
        <LinhaPokemon
          key={`${treinador.id}-${indice}`}
          pokemon={pokemon}
          onWiki={onWiki}
          fontesDe={fontesDe}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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

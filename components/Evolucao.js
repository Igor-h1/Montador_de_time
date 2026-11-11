// components/Evolucao.js
// Cartão "Evolução": de quem o Pokémon evolui e para quem ele evolui, com o método
// (nível, pedra, troca, felicidade ou "condição especial"). Tocar em um Pokémon abre ele.
// Props:
//   dados      resultado de obterEvolucao() (ou null para não mostrar o cartão)
//   onAbrir    chamado com o Pokémon tocado
//   fontesDe   função: Pokémon -> lista de fontes de sprite (ver SpriteRemoto)
//   bloqueado  (opcional) função: Pokémon -> true se ele não existe no jogo (mostra 🔒)

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import SpriteRemoto from './SpriteRemoto';
import { COR } from '../data/tema';
import { tocarSomPokemon } from '../services/sons';

const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

function LinhaEvolucao({ item, onAbrir, fontesDe, bloqueado }) {
  const { pokemon, metodo } = item;
  const trancado = bloqueado ? bloqueado(pokemon) : false;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir ${pokemon.nome}`}
      onPress={() => {
        tocarSomPokemon(pokemon);
        onAbrir(pokemon);
      }}
      style={({ pressed }) => [styles.linha, pressed && styles.pressionado]}
    >
      <View style={styles.spriteBox}>
        <SpriteRemoto fontes={fontesDe(pokemon)} style={styles.sprite} />
      </View>

      <View style={styles.textos}>
        <Text style={styles.nome} numberOfLines={1}>
          #{String(pokemon.id).padStart(3, '0')} {pokemon.nome}
          {trancado ? ' 🔒' : ''}
        </Text>
        <Text style={styles.metodo} numberOfLines={1}>
          {capitalizar(metodo)}
        </Text>
      </View>

      <Text style={styles.seta}>›</Text>
    </Pressable>
  );
}

export default function Evolucao({ dados, onAbrir, fontesDe, bloqueado }) {
  if (!dados) return null;
  const { de, para } = dados;

  return (
    <View style={styles.secao}>
      <Text style={styles.titulo}>Evolução</Text>

      {!de && para.length === 0 ? (
        <Text style={styles.suave}>Não tem pré-evolução nem evolução.</Text>
      ) : null}

      {de ? (
        <>
          <Text style={styles.rotulo}>Evolui de</Text>
          <LinhaEvolucao item={de} onAbrir={onAbrir} fontesDe={fontesDe} bloqueado={bloqueado} />
        </>
      ) : null}

      {para.length > 0 ? (
        <>
          <Text style={styles.rotulo}>Evolui para</Text>
          {para.map((item) => (
            <LinhaEvolucao
              key={item.pokemon.id}
              item={item}
              onAbrir={onAbrir}
              fontesDe={fontesDe}
              bloqueado={bloqueado}
            />
          ))}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  secao: { backgroundColor: COR.superficie, borderRadius: 16, padding: 14, marginBottom: 16 },
  titulo: { fontSize: 16, fontWeight: 'bold', color: COR.texto, marginBottom: 10 },
  suave: { color: COR.textoSuave },
  rotulo: { fontSize: 12, fontWeight: '600', color: COR.textoSuave, marginTop: 4, marginBottom: 6 },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COR.branco,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COR.borda,
    padding: 8,
    marginBottom: 8,
  },
  pressionado: { opacity: 0.75 },
  spriteBox: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: COR.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sprite: { width: 44, height: 44 },
  textos: { flex: 1 },
  nome: { fontSize: 15, fontWeight: '700', color: COR.texto },
  metodo: { fontSize: 12, color: COR.textoSuave, marginTop: 2 },
  seta: { fontSize: 24, color: COR.textoSuave, marginLeft: 8 },
});

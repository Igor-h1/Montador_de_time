// components/StatusBase.js
// Cartão com os 6 status base do Pokémon (barras coloridas) e o total.
// Props: stats = [HP, Ataque, Defesa, Atq. Esp., Def. Esp., Velocidade] (campo "stats" do Pokémon)
// Os status vêm embutidos em data/pokemons.js, então funcionam sem internet.
// Se o pokemons.js ainda for o formato antigo (sem "stats"), o cartão simplesmente não aparece.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STATUS } from '../data/stats';
import { COR } from '../data/tema';

const MAX_BARRA = 200; // valor que enche a barra (acima disso, a barra fica cheia)

function corDoValor(valor) {
  if (valor < 50) return '#E5534B';
  if (valor < 80) return '#F2A33A';
  if (valor < 100) return '#E3C93B';
  if (valor < 130) return '#7CC04A';
  return '#2EAD4B';
}

export default function StatusBase({ stats }) {
  if (!Array.isArray(stats) || stats.length !== STATUS.length) return null;

  const total = stats.reduce((soma, valor) => soma + valor, 0);

  return (
    <View style={styles.secao}>
      <Text style={styles.titulo}>Status base</Text>

      {STATUS.map((status, i) => (
        <View key={status.chave} style={styles.linha}>
          <Text style={styles.rotulo}>{status.nome}</Text>
          <Text style={styles.valor}>{stats[i]}</Text>
          <View style={styles.trilho}>
            <View
              style={[
                styles.barra,
                {
                  width: `${Math.min(100, (stats[i] / MAX_BARRA) * 100)}%`,
                  backgroundColor: corDoValor(stats[i]),
                },
              ]}
            />
          </View>
        </View>
      ))}

      <View style={styles.linha}>
        <Text style={[styles.rotulo, styles.negrito]}>Total</Text>
        <Text style={[styles.valor, styles.negrito]}>{total}</Text>
        <View style={styles.trilho} />
      </View>

      <Text style={styles.nota}>
        Valores atuais da PokéAPI: alguns Pokémon tiveram ajustes depois da 5ª geração e podem
        diferir um pouco dos jogos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  secao: { backgroundColor: COR.superficie, borderRadius: 16, padding: 14, marginBottom: 16 },
  titulo: { fontSize: 16, fontWeight: 'bold', color: COR.texto, marginBottom: 10 },
  linha: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  rotulo: { width: 78, fontSize: 12, color: COR.textoSuave, fontWeight: '600' },
  valor: { width: 34, fontSize: 13, color: COR.texto, fontWeight: '700', textAlign: 'right', marginRight: 8 },
  trilho: { flex: 1, height: 8, borderRadius: 4, backgroundColor: COR.borda, overflow: 'hidden' },
  barra: { height: 8, borderRadius: 4 },
  negrito: { color: COR.texto, fontWeight: 'bold' },
  nota: { fontSize: 10, color: COR.textoSuave, marginTop: 6 },
});

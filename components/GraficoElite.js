// components/GraficoElite.js
// Gráfico da Equipe: uma linha por treinador da Elite dos 4 (e o campeão), com o
// tipo dele na frente e o medidor de 5 quadrados. Embaixo, a dificuldade estimada
// e o botão "Saiba mais".
// Props:
//   analise      resultado de analisarElite(jogoId, equipe) (ou null)
//   onSaberMais  callback do botão

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Botao from './Botao';
import Medidor from './Medidor';
import SeloNivel from './SeloNivel';
import EtiquetaTreinador from './EtiquetaTreinador';
import { COR } from '../data/tema';

export default function GraficoElite({ analise, onSaberMais }) {
  if (!analise) return null;

  return (
    <View style={styles.secao}>
      <Text style={styles.titulo}>Elite dos 4 · {analise.regiao}</Text>
      <Text style={styles.subtitulo}>
        Como os tipos da sua equipe se saem contra cada treinador
      </Text>

      {analise.principais.map((treinador) => (
        <View key={treinador.id} style={styles.linha}>
          <View style={styles.esquerda}>
            <View style={styles.nomeLinha}>
              <Text style={styles.nome} numberOfLines={1}>
                {treinador.nome}
              </Text>
              <View style={styles.etiqueta}>
                <EtiquetaTreinador treinador={treinador} />
              </View>
            </View>
            <Text style={styles.categoria}>
              {treinador.categoria === 'campeao' ? 'Campeão' : 'Elite dos 4'}
            </Text>
          </View>
          <Medidor quadrados={treinador.quadrados} sentido={treinador.sentido} />
        </View>
      ))}

      <View style={styles.legenda}>
        <View style={[styles.amostra, { backgroundColor: COR.verde, borderColor: COR.verde }]} />
        <Text style={styles.legendaTexto}>Vantagem</Text>
        <View style={[styles.amostra, { backgroundColor: COR.vermelho, borderColor: COR.vermelho }]} />
        <Text style={styles.legendaTexto}>Desvantagem</Text>
        <View style={styles.amostra} />
        <Text style={styles.legendaTexto}>Neutro</Text>
      </View>

      <View style={styles.divisor} />

      {analise.temEquipe ? (
        <View style={styles.dificuldade}>
          <Text style={styles.dificuldadeTitulo}>Dificuldade estimada</Text>
          <SeloNivel nivel={analise.dificuldade} />
        </View>
      ) : (
        <Text style={styles.dica}>
          Adicione Pokémon à equipe para ver a vantagem e a dificuldade.
        </Text>
      )}

      <Text style={styles.aviso}>
        Estimativa só pelos tipos: não considera nível, golpes, habilidades nem itens.
      </Text>

      <Botao texto="Saiba mais" variante="secundaria" onPress={onSaberMais} />
    </View>
  );
}

const styles = StyleSheet.create({
  secao: {
    backgroundColor: COR.superficie,
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
  },
  titulo: { fontSize: 16, fontWeight: 'bold', color: COR.texto },
  subtitulo: { fontSize: 12, color: COR.textoSuave, marginTop: 2, marginBottom: 12 },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  esquerda: { flex: 1, marginRight: 10 },
  nomeLinha: { flexDirection: 'row', alignItems: 'center' },
  nome: { fontSize: 15, fontWeight: '700', color: COR.texto, flexShrink: 1 },
  // marginBottom negativo cancela a margem inferior da etiqueta, alinhando com o nome
  etiqueta: { marginLeft: 6, marginBottom: -4 },
  categoria: { fontSize: 11, color: COR.textoSuave },
  legenda: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  amostra: {
    width: 12,
    height: 12,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    marginRight: 4,
  },
  legendaTexto: { fontSize: 11, color: COR.textoSuave, marginRight: 12 },
  divisor: { height: 1, backgroundColor: COR.borda, marginVertical: 12 },
  dificuldade: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dificuldadeTitulo: { fontSize: 15, fontWeight: 'bold', color: COR.texto },
  dica: { color: COR.textoSuave, marginBottom: 8 },
  aviso: { fontSize: 11, color: COR.textoSuave, marginBottom: 8 },
});

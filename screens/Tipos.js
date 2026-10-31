// screens/Tipos.js
// "Ver detalhes" dos tipos da equipe: para cada um dos 17 tipos, mostra como a
// equipe se defende (🛡️) e ataca (⚔️), do tipo mais problemático para o menos.
// Jogo vem por route.params ({ jogo }).

import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BadgeTipo from '../components/BadgeTipo';
import Medidor from '../components/Medidor';
import { COR } from '../data/tema';
import { analisarTipos } from '../services/tiposService';
import { useEquipe } from '../context/EquipeContext';

const VERDE = '#1F7A35';
const VERMELHO = '#B3001B';

// "Fracos: Blaziken, Manectric" (some se a lista estiver vazia)
function Detalhe({ rotulo, nomes, cor }) {
  if (nomes.length === 0) return null;
  return (
    <Text style={[styles.detalhe, { color: cor }]}>
      <Text style={styles.detalheRotulo}>{rotulo}: </Text>
      {nomes.join(', ')}
    </Text>
  );
}

function LinhaTipo({ linha }) {
  return (
    <View style={styles.cartao}>
      <View style={styles.alinharEsquerda}>
        <BadgeTipo tipo={linha.tipo} />
      </View>

      <View style={styles.medidores}>
        <View>
          <Text style={styles.medidorRotulo}>🛡️ Defesa</Text>
          <View style={styles.ajusteMedidor}>
            <Medidor
              quadrados={linha.defesa.quadrados}
              sentido={linha.defesa.sentido}
              tamanho={18}
            />
          </View>
        </View>
        <View>
          <Text style={styles.medidorRotulo}>⚔️ Ataque</Text>
          <View style={styles.ajusteMedidor}>
            <Medidor
              quadrados={linha.ataque.quadrados}
              sentido={linha.ataque.sentido}
              tamanho={18}
            />
          </View>
        </View>
      </View>

      <Detalhe rotulo="Fracos" nomes={linha.fracos} cor={VERMELHO} />
      <Detalhe rotulo="Resistem" nomes={linha.resistem} cor={VERDE} />
      <Detalhe rotulo="Imunes" nomes={linha.imunes} cor={VERDE} />
      {linha.atacamBem.length > 0 ? (
        <Detalhe rotulo="Atacam bem" nomes={linha.atacamBem} cor={VERDE} />
      ) : (
        <Text style={[styles.detalhe, { color: COR.textoSuave }]}>
          Nenhum Pokémon seu acerta esse tipo em cheio.
        </Text>
      )}
    </View>
  );
}

export default function Tipos({ route }) {
  const jogoId = route.params.jogo;
  const insets = useSafeAreaInsets();
  const { pokemonsDaEquipe } = useEquipe();

  const equipe = useMemo(() => pokemonsDaEquipe(jogoId), [pokemonsDaEquipe, jogoId]);
  const analise = useMemo(() => analisarTipos(equipe), [equipe]);

  if (!analise) {
    return (
      <View style={styles.centro}>
        <Text style={styles.suave}>
          Adicione Pokémon à equipe para ver como ela lida com cada tipo.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.resumo}>
        <Text style={styles.resumoTitulo}>Resumo</Text>

        <Text style={styles.resumoRotulo}>Pontos fracos da defesa</Text>
        {analise.pontosFracos.length > 0 ? (
          <View style={styles.chips}>
            {analise.pontosFracos.map((linha) => (
              <BadgeTipo key={linha.tipo} tipo={linha.tipo} />
            ))}
          </View>
        ) : (
          <Text style={styles.resumoTexto}>
            Nenhum tipo deixa a sua equipe em desvantagem na defesa.
          </Text>
        )}

        <Text style={styles.resumoRotulo}>Tipos que nenhum Pokémon seu acerta em cheio</Text>
        {analise.semCobertura.length > 0 ? (
          <View style={styles.chips}>
            {analise.semCobertura.map((linha) => (
              <BadgeTipo key={linha.tipo} tipo={linha.tipo} />
            ))}
          </View>
        ) : (
          <Text style={styles.resumoTexto}>Sua equipe acerta todos os tipos em cheio.</Text>
        )}

        <Text style={styles.explicacao}>
          🛡️ Defesa: vermelho = Pokémon fracos a esse tipo; verde = Pokémon que resistem ou são
          imunes (vale metade de uma fraqueza).{'\n'}⚔️ Ataque: verde = quantos Pokémon seus
          acertam esse tipo em cheio; vermelho = só causam dano fraco ou nulo.{'\n'}Considera só
          os tipos dos seus Pokémon, não os golpes que eles sabem.
        </Text>
      </View>

      <Text style={styles.secao}>Do mais problemático para o menos</Text>
      {analise.linhas.map((linha) => (
        <LinhaTipo key={linha.tipo} linha={linha} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: COR.fundo, flexGrow: 1 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  suave: { color: COR.textoSuave, textAlign: 'center' },

  resumo: { backgroundColor: COR.superficie, borderRadius: 16, padding: 14 },
  resumoTitulo: { fontSize: 16, fontWeight: 'bold', color: COR.texto, marginBottom: 10 },
  resumoRotulo: { fontSize: 13, fontWeight: '600', color: COR.texto, marginBottom: 6 },
  resumoTexto: { color: COR.textoSuave, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  explicacao: { fontSize: 11, color: COR.textoSuave, marginTop: 6, lineHeight: 16 },

  secao: { fontSize: 16, fontWeight: 'bold', color: COR.texto, marginTop: 16, marginBottom: 8 },
  cartao: {
    backgroundColor: COR.branco,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COR.borda,
    padding: 12,
    marginBottom: 10,
  },
  alinharEsquerda: { alignSelf: 'flex-start' },
  medidores: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  medidorRotulo: { fontSize: 11, fontWeight: '600', color: COR.textoSuave, marginBottom: 4 },
  // O medidor tem uma margem à esquerda em cada quadrado; este ajuste alinha com o rótulo
  ajusteMedidor: { marginLeft: -4 },
  detalhe: { fontSize: 12, marginTop: 2 },
  detalheRotulo: { fontWeight: '700' },
});

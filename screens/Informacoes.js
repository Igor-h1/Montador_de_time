// screens/Informacoes.js
// Opção "Informações" do menu: 3 assuntos para a pessoa escolher.
// Os textos ficam em data/informacoes.js. Tocar em um assunto abre InformacaoTexto.

import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { INFORMACOES } from '../data/informacoes';
import { COR, SOMBRA } from '../data/tema';
import { tocarSom } from '../services/sons';

export default function Informacoes({ navigation }) {
  const insets = useSafeAreaInsets(); // margem para os botões do Android

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <Text style={styles.intro}>Escolha um assunto:</Text>

      {INFORMACOES.map((secao) => (
        <Pressable
          key={secao.id}
          accessibilityRole="button"
          onPress={() => {
            tocarSom('confirmar');
            navigation.navigate('InformacaoTexto', { secao: secao.id });
          }}
          style={({ pressed }) => [styles.cartao, pressed && styles.pressionado]}
        >
          <Text style={styles.icone}>{secao.icone}</Text>
          <View style={styles.textos}>
            <Text style={styles.titulo}>{secao.titulo}</Text>
            <Text style={styles.resumo}>{secao.resumo}</Text>
          </View>
          <Text style={styles.seta}>›</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: COR.fundo, flexGrow: 1 },
  intro: { fontSize: 14, color: COR.textoSuave, marginBottom: 14 },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COR.branco,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COR.borda,
    padding: 16,
    marginBottom: 12,
    ...SOMBRA,
  },
  pressionado: { opacity: 0.8 },
  icone: { fontSize: 32, width: 48, textAlign: 'center', marginRight: 12 },
  textos: { flex: 1 },
  titulo: { fontSize: 17, fontWeight: 'bold', color: COR.texto },
  resumo: { fontSize: 13, color: COR.textoSuave, marginTop: 2 },
  seta: { fontSize: 26, color: COR.textoSuave, marginLeft: 8 },
});

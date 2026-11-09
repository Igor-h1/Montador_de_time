// screens/InformacaoTexto.js
// Texto de um assunto da opção "Informações" (id vem por route.params.secao).
// Mostra os blocos de data/informacoes.js: parágrafos, listas e links. Os links abrem no
// navegador (precisam de internet; sem conexão aparece um aviso).

import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { buscarInformacao } from '../data/informacoes';
import { COR } from '../data/tema';
import { abrirLink } from '../services/links';

export default function InformacaoTexto({ route }) {
  const secao = buscarInformacao(route.params.secao);
  const insets = useSafeAreaInsets(); // margem para os botões do Android
  const [aviso, setAviso] = useState(null);

  if (!secao) {
    return (
      <View style={styles.centro}>
        <Text style={styles.suave}>Assunto não encontrado.</Text>
      </View>
    );
  }

  async function aoAbrirLink(url) {
    const resultado = await abrirLink(url);
    setAviso(resultado.ok ? null : resultado.motivo);
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.topo}>
        <Text style={styles.icone}>{secao.icone}</Text>
        <Text style={styles.titulo}>{secao.titulo}</Text>
        <Text style={styles.resumo}>{secao.resumo}</Text>
      </View>

      {aviso ? <Text style={styles.faixaErro}>{aviso}</Text> : null}

      {secao.blocos.map((bloco, i) => (
        <View key={i} style={styles.bloco}>
          {bloco.titulo ? <Text style={styles.blocoTitulo}>{bloco.titulo}</Text> : null}

          {(bloco.paragrafos || []).map((texto, j) => (
            <Text key={`p${j}`} style={styles.paragrafo}>
              {texto}
            </Text>
          ))}

          {(bloco.itens || []).map((item, j) => (
            <View key={`i${j}`} style={styles.item}>
              <Text style={styles.marcador}>•</Text>
              <Text style={styles.itemTexto}>{item}</Text>
            </View>
          ))}

          {(bloco.links || []).map((link, j) => (
            <Pressable
              key={`l${j}`}
              accessibilityRole="link"
              accessibilityLabel={`Abrir ${link.rotulo}`}
              onPress={() => aoAbrirLink(link.url)}
              style={({ pressed }) => [styles.link, pressed && styles.pressionado]}
            >
              <View style={styles.linkTextos}>
                <Text style={styles.linkRotulo}>{link.rotulo}</Text>
                {link.descricao ? <Text style={styles.linkDescricao}>{link.descricao}</Text> : null}
              </View>
              <Text style={styles.linkSeta}>↗</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: COR.fundo, flexGrow: 1 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  suave: { color: COR.textoSuave, textAlign: 'center' },

  topo: { alignItems: 'center', marginBottom: 16 },
  icone: { fontSize: 44 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: COR.texto, marginTop: 6, textAlign: 'center' },
  resumo: { fontSize: 13, color: COR.textoSuave, marginTop: 4, textAlign: 'center' },

  faixaErro: {
    backgroundColor: '#F8D7DA',
    color: '#842029',
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },

  bloco: { backgroundColor: COR.superficie, borderRadius: 16, padding: 14, marginBottom: 12 },
  blocoTitulo: { fontSize: 16, fontWeight: 'bold', color: COR.texto, marginBottom: 8 },
  paragrafo: { fontSize: 14, lineHeight: 21, color: COR.texto, marginBottom: 8 },
  item: { flexDirection: 'row', marginBottom: 6 },
  marcador: { fontSize: 14, color: COR.vermelho, width: 16, lineHeight: 21 },
  itemTexto: { flex: 1, fontSize: 14, lineHeight: 21, color: COR.texto },

  link: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COR.branco,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COR.borda,
    padding: 10,
    marginBottom: 8,
  },
  pressionado: { opacity: 0.75 },
  linkTextos: { flex: 1 },
  linkRotulo: { fontSize: 15, fontWeight: '700', color: COR.vermelho },
  linkDescricao: { fontSize: 12, color: COR.textoSuave, marginTop: 2 },
  linkSeta: { fontSize: 18, color: COR.textoSuave, marginLeft: 8 },
});

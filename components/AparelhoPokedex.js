// components/AparelhoPokedex.js
// Aparelho em forma de Pokédex, desenhado só com Views (sem imagem de fundo), para
// se ajustar a qualquer tamanho de celular: a tela branca do meio estica e o resto
// tem tamanho fixo.
//   topo:   lente azul, nome do app e pokébola
//   meio:   tela branca (recebe o conteúdo em "children")
//   baixo:  direcional, tela verde (LCD) e os botões ✕ e ✓
// Props:
//   nome         nome do app (topo)
//   children     conteúdo da tela branca
//   lcdTitulo    título na tela verde
//   lcdTexto     texto na tela verde
//   onCima / onBaixo / onEsquerda / onDireita   direcional
//   onConfirmar  botão ✓
//   onCancelar   botão ✕

import React from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { COR, APARELHO } from '../data/tema';

// Fonte monoespaçada do sistema para a tela verde (depois dá para trocar pela fonte pixelada)
const FONTE_LCD = Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' });

function Lente() {
  return (
    <View style={styles.lente}>
      <View style={styles.lenteInterna}>
        <View style={styles.brilho} />
      </View>
    </View>
  );
}

function Pokebola() {
  return (
    <View style={styles.pokebola}>
      <View style={styles.pokebolaCima} />
      <View style={styles.pokebolaBaixo} />
      <View style={styles.pokebolaLinha} />
      <View style={styles.pokebolaBotao} />
    </View>
  );
}

function Direcional({ onCima, onBaixo, onEsquerda, onDireita }) {
  return (
    <View style={styles.direcional}>
      <View style={styles.cruzVertical} />
      <View style={styles.cruzHorizontal} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cima"
        hitSlop={4}
        onPress={onCima}
        style={[styles.zona, { top: 0, left: 28 }]}
      >
        <Text style={styles.seta}>▲</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Baixo"
        hitSlop={4}
        onPress={onBaixo}
        style={[styles.zona, { top: 56, left: 28 }]}
      >
        <Text style={styles.seta}>▼</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Esquerda"
        hitSlop={4}
        onPress={onEsquerda}
        style={[styles.zona, { top: 28, left: 0 }]}
      >
        <Text style={styles.seta}>◀</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Direita"
        hitSlop={4}
        onPress={onDireita}
        style={[styles.zona, { top: 28, left: 56 }]}
      >
        <Text style={styles.seta}>▶</Text>
      </Pressable>
    </View>
  );
}

function BotaoRedondo({ tipo, onPress }) {
  const confirmar = tipo === 'confirmar';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={confirmar ? 'Confirmar' : 'Cancelar'}
      onPress={onPress}
      style={({ pressed }) => [
        styles.botaoRedondo,
        { backgroundColor: confirmar ? APARELHO.confirmar : APARELHO.cancelar },
        pressed && styles.pressionado,
      ]}
    >
      <Text style={styles.botaoRedondoTexto}>{confirmar ? '✓' : '✕'}</Text>
    </Pressable>
  );
}

export default function AparelhoPokedex({
  nome,
  children,
  lcdTitulo,
  lcdTexto,
  onCima,
  onBaixo,
  onEsquerda,
  onDireita,
  onConfirmar,
  onCancelar,
}) {
  return (
    <View style={styles.aparelho}>
      <View style={styles.topo}>
        <Lente />
        <View style={styles.faixaNome}>
          <Text style={styles.nome} numberOfLines={1}>
            {nome}
          </Text>
        </View>
        <Pokebola />
      </View>

      <View style={styles.tela}>{children}</View>

      <View style={styles.painel}>
        <View style={styles.faixaVerde} />
        <View style={styles.controles}>
          <Direcional
            onCima={onCima}
            onBaixo={onBaixo}
            onEsquerda={onEsquerda}
            onDireita={onDireita}
          />

          <View style={styles.lcd}>
            <Text style={styles.lcdTitulo} numberOfLines={1}>
              {lcdTitulo}
            </Text>
            <Text style={styles.lcdTexto} numberOfLines={5}>
              {lcdTexto}
            </Text>
          </View>

          <View style={styles.botoes}>
            <BotaoRedondo tipo="cancelar" onPress={onCancelar} />
            <BotaoRedondo tipo="confirmar" onPress={onConfirmar} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Sem cantos arredondados, borda nem sombra: o aparelho vai até as bordas da tela
  aparelho: {
    flex: 1,
    backgroundColor: APARELHO.corpo,
  },

  // ----- topo -----
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  lente: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: APARELHO.borda,
    backgroundColor: COR.branco,
    padding: 3,
  },
  lenteInterna: { flex: 1, borderRadius: 22, backgroundColor: APARELHO.lente },
  brilho: {
    position: 'absolute',
    top: 6,
    left: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  faixaNome: {
    flex: 1,
    marginHorizontal: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.14)',
    alignItems: 'center',
  },
  nome: {
    color: COR.branco,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pokebola: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: APARELHO.borda,
    overflow: 'hidden',
    backgroundColor: COR.branco,
  },
  pokebolaCima: { flex: 1, backgroundColor: APARELHO.corpoClaro },
  pokebolaBaixo: { flex: 1, backgroundColor: COR.branco },
  pokebolaLinha: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 3,
    marginTop: -1.5,
    backgroundColor: APARELHO.borda,
  },
  pokebolaBotao: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 14,
    height: 14,
    marginTop: -7,
    marginLeft: -7,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: APARELHO.borda,
    backgroundColor: COR.branco,
  },

  // ----- tela branca -----
  tela: {
    flex: 1,
    marginHorizontal: 14,
    backgroundColor: COR.branco,
    borderWidth: 3,
    borderColor: APARELHO.telaBorda,
    borderRadius: 6,
    padding: 12,
  },

  // ----- painel de baixo -----
  painel: {
    margin: 14,
    padding: 10,
    backgroundColor: APARELHO.painel,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: APARELHO.painelBorda,
  },
  faixaVerde: {
    height: 14,
    borderRadius: 7,
    backgroundColor: APARELHO.faixaVerde,
    borderWidth: 2,
    borderColor: APARELHO.lcdBorda,
    marginBottom: 10,
  },
  controles: { flexDirection: 'row', alignItems: 'center' },

  direcional: { width: 84, height: 84 },
  cruzVertical: {
    position: 'absolute',
    top: 0,
    left: 28,
    width: 28,
    height: 84,
    borderRadius: 6,
    backgroundColor: APARELHO.direcional,
  },
  cruzHorizontal: {
    position: 'absolute',
    top: 28,
    left: 0,
    width: 84,
    height: 28,
    borderRadius: 6,
    backgroundColor: APARELHO.direcional,
  },
  zona: { position: 'absolute', width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  seta: { color: APARELHO.seta, fontSize: 13 },

  lcd: {
    flex: 1,
    height: 96,
    marginHorizontal: 8,
    padding: 6,
    backgroundColor: APARELHO.lcd,
    borderWidth: 2,
    borderColor: APARELHO.lcdBorda,
    borderRadius: 4,
  },
  lcdTitulo: {
    fontFamily: FONTE_LCD,
    fontSize: 12,
    fontWeight: 'bold',
    color: APARELHO.lcdTexto,
    marginBottom: 2,
  },
  lcdTexto: { fontFamily: FONTE_LCD, fontSize: 11, lineHeight: 14, color: APARELHO.lcdTexto },

  botoes: { width: 44, alignItems: 'center', justifyContent: 'space-between', height: 92 },
  botaoRedondo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: APARELHO.painelBorda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoRedondoTexto: { color: COR.branco, fontSize: 18, fontWeight: 'bold' },
  pressionado: { opacity: 0.75 },
});

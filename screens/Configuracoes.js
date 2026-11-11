// screens/Configuracoes.js
// Opção "Configurações" do menu: ligar/desligar o som, o modo escuro e o modo offline (simulado).
// As escolhas ficam em services/configuracoes.js (só em memória por enquanto).

import React from 'react';
import { ScrollView, View, Text, Switch, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SOMBRA } from '../data/tema';
import { useTema, useEstilos } from '../services/tema';
import { useConfiguracoes, definirConfiguracao } from '../services/configuracoes';
import { tocarSom } from '../services/sons';

function LinhaOpcao({ icone, titulo, descricao, valor, onChange }) {
  const { COR } = useTema();
  const styles = useEstilos(criarEstilos);
  return (
    <View style={styles.cartao}>
      <Text style={styles.icone}>{icone}</Text>
      <View style={styles.textos}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.descricao}>{descricao}</Text>
      </View>
      <Switch
        accessibilityLabel={titulo}
        value={valor}
        onValueChange={onChange}
        trackColor={{ false: COR.contorno, true: COR.vermelho }}
        thumbColor={COR.branco}
      />
    </View>
  );
}

export default function Configuracoes() {
  const styles = useEstilos(criarEstilos);
  const insets = useSafeAreaInsets(); // margem para os botões do Android
  const { somAtivo, modoOffline, modoEscuro } = useConfiguracoes();

  function aoMudarSom(valor) {
    definirConfiguracao('somAtivo', valor);
    if (valor) tocarSom('botao'); // confirma que o som voltou
  }

  function aoMudarEscuro(valor) {
    definirConfiguracao('modoEscuro', valor);
    tocarSom(valor ? 'confirmar' : 'cancelar');
  }

  function aoMudarOffline(valor) {
    definirConfiguracao('modoOffline', valor);
    tocarSom(valor ? 'confirmar' : 'cancelar');
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <LinhaOpcao
        icone={somAtivo ? '🔊' : '🔇'}
        titulo="Som"
        descricao="Sons dos botões do menu."
        valor={somAtivo}
        onChange={aoMudarSom}
      />

      <LinhaOpcao
        icone={modoEscuro ? '🌙' : '☀️'}
        titulo="Modo escuro"
        descricao="Troca as cores do app para um visual escuro."
        valor={modoEscuro}
        onChange={aoMudarEscuro}
      />

      <LinhaOpcao
        icone="📡"
        titulo="Modo offline"
        descricao="Simula estar sem internet, para testar o app."
        valor={modoOffline}
        onChange={aoMudarOffline}
      />

      <View style={styles.explicacao}>
        <Text style={styles.explicacaoTitulo}>O que o modo offline faz</Text>
        <Text style={styles.item}>• "Montar time" mostra só FireRed, LeafGreen, Ruby, Sapphire e Emerald.</Text>
        <Text style={styles.item}>• "Ver Pokédex" e o Ambiente livre ficam bloqueados.</Text>
        <Text style={styles.item}>• O shiny fica desabilitado e os botões "Saiba mais" avisam que não há internet.</Text>
        <Text style={styles.item}>
          • A lista de um jogo online que ainda não foi carregada não abre.
        </Text>
        <Text style={styles.aviso}>
          A internet do aparelho não é desligada de verdade: só o app finge que está sem conexão.
          As escolhas voltam ao padrão quando o app é fechado.
        </Text>
      </View>
    </ScrollView>
  );
}

const criarEstilos = (COR) => StyleSheet.create({
  container: { padding: 16, backgroundColor: COR.fundo, flexGrow: 1 },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COR.cartao,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COR.borda,
    padding: 16,
    marginBottom: 12,
    ...SOMBRA,
  },
  icone: { fontSize: 30, width: 44, textAlign: 'center', marginRight: 10 },
  textos: { flex: 1, marginRight: 8 },
  titulo: { fontSize: 17, fontWeight: 'bold', color: COR.texto },
  descricao: { fontSize: 13, color: COR.textoSuave, marginTop: 2 },

  explicacao: { backgroundColor: COR.superficie, borderRadius: 16, padding: 14, marginTop: 4 },
  explicacaoTitulo: { fontSize: 16, fontWeight: 'bold', color: COR.texto, marginBottom: 8 },
  item: { fontSize: 14, lineHeight: 21, color: COR.texto, marginBottom: 4 },
  aviso: { fontSize: 12, color: COR.textoSuave, marginTop: 8 },
});

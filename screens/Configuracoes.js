// screens/Configuracoes.js
// Opção "Configurações" do menu: ligar/desligar o som, o modo escuro e o modo offline (simulado),
// e resetar todos os times de uma vez. Som e modo escuro ficam salvos no aparelho
// (services/configuracoes.js); o modo offline volta a desligado quando o app é aberto.

import React, { useState } from 'react';
import { ScrollView, View, Text, Switch, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SOMBRA } from '../data/tema';
import { useTema, useEstilos } from '../services/tema';
import { useConfiguracoes, definirConfiguracao } from '../services/configuracoes';
import { tocarSom } from '../services/sons';
import Botao from '../components/Botao';
import { useEquipe } from '../context/EquipeContext';

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
  const { equipe, limparTodas } = useEquipe();
  const [aviso, setAviso] = useState(null);

  // Quantos Pokémon e quantos times (jogos + ambiente livre) estão preenchidos
  const listas = Object.values(equipe);
  const totalPokemon = listas.reduce((soma, lista) => soma + lista.length, 0);
  const totalTimes = listas.filter((lista) => lista.length > 0).length;

  function aoMudarSom(valor) {
    definirConfiguracao('somAtivo', valor);
    if (valor) tocarSom('botao'); // confirma que o som voltou
  }

  function aoMudarEscuro(valor) {
    definirConfiguracao('modoEscuro', valor);
    tocarSom(valor ? 'confirmar' : 'cancelar');
  }

  // Pergunta antes de apagar: não dá para desfazer
  function aoResetarTimes() {
    Alert.alert(
      'Resetar todos os times?',
      `Isso remove os ${totalPokemon} Pokémon de ${totalTimes} ${
        totalTimes === 1 ? 'time' : 'times'
      } (todos os jogos e o Ambiente livre). Não dá para desfazer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: () => {
            limparTodas();
            setAviso('Todos os times foram resetados.');
          },
        },
      ]
    );
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
          O modo offline volta a desligado quando o app é aberto; o som e o modo escuro ficam salvos.
        </Text>
      </View>

      <View style={styles.explicacao}>
        <Text style={styles.explicacaoTitulo}>Times salvos</Text>
        <Text style={styles.item}>
          {totalPokemon === 0
            ? 'Nenhum time preenchido no momento.'
            : `${totalPokemon} Pokémon em ${totalTimes} ${totalTimes === 1 ? 'time' : 'times'}.`}
        </Text>
        <Text style={styles.aviso}>
          Os times ficam salvos no aparelho. Aqui você apaga todos de uma vez, em vez de remover
          os Pokémon um por um.
        </Text>
        <Botao
          texto="Resetar todos os times"
          variante="perigo"
          desabilitado={totalPokemon === 0}
          onPress={aoResetarTimes}
        />
        {aviso && totalPokemon === 0 ? <Text style={styles.faixaOk}>{aviso}</Text> : null}
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

  explicacao: { backgroundColor: COR.superficie, borderRadius: 16, padding: 14, marginTop: 12 },
  explicacaoTitulo: { fontSize: 16, fontWeight: 'bold', color: COR.texto, marginBottom: 8 },
  item: { fontSize: 14, lineHeight: 21, color: COR.texto, marginBottom: 4 },
  aviso: { fontSize: 12, color: COR.textoSuave, marginTop: 8 },
  faixaOk: {
    backgroundColor: COR.okFundo,
    color: COR.okTexto,
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    marginTop: 6,
    overflow: 'hidden',
  },
});

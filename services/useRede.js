// services/useRede.js
// Hook que diz se há internet, e atualiza sozinho quando a conexão muda.
// Retorna: true (online), false (offline) ou null (ainda verificando).

import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export default function useRede() {
  const [online, setOnline] = useState(null);

  useEffect(() => {
    // O listener é chamado já na hora com o estado atual e depois a cada mudança
    const cancelar = NetInfo.addEventListener((estado) => {
      // isInternetReachable pode ser null (ainda testando): nesse caso confiamos em isConnected
      setOnline(estado.isConnected === true && estado.isInternetReachable !== false);
    });
    return cancelar; // cleanup: para de ouvir quando o componente sai da tela
  }, []);

  return online;
}

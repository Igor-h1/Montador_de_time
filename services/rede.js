// services/rede.js
// Checagem pontual de internet (fora de componentes). Respeita o modo offline simulado
// das Configurações. Para componentes, use o hook useRede.

import NetInfo from '@react-native-community/netinfo';
import { obterConfiguracoes } from './configuracoes';

// true = sem internet (simulada ou de verdade)
export async function semInternet() {
  if (obterConfiguracoes().modoOffline) return true;
  const rede = await NetInfo.fetch();
  // isInternetReachable pode ser null (ainda não sabe): nesse caso tentamos seguir
  return rede.isConnected === false || rede.isInternetReachable === false;
}

import getNetworkInfo from '../network/networkInfo';
import { setServerBaseUrl } from '../../../frontend/utils/config/dbURL';
import NetInfo from '@react-native-community/netinfo';

const initializeNetwork = async () => {
  console.log('Network initialization started');

  // NetInfo listener for connection changes
  const unsubscribe = NetInfo.addEventListener(state => {
    console.log('Connection type:', state.type);
    console.log('Is connected?', state.isConnected);
  });

  // Get network information
  const networkInfo = await getNetworkInfo();
  console.log('Network info retrieved:', networkInfo);
  if (networkInfo && networkInfo.ipv4Address) {
    // const baseUrl = `http://${networkInfo.ipv4Address}:5432`;
    const baseUrl = `http://10.0.2.2:5432`;
    console.log('Setting server base URL to:', baseUrl);
    setServerBaseUrl(baseUrl);
  } else {
    console.error('Failed to fetch network information');
  }

  return unsubscribe; // Return the unsubscribe function to call it in App.tsx
};

export default initializeNetwork;

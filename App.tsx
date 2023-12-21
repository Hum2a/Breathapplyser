import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AppNavigation from './src/frontend/components/navigation/navigation';
import BackgroundBAC from './src/frontend/utils/calculations/BackgroundBAC';
import DbAPI from './src/frontend/services/api/DBapi';
import { UserProvider } from './src/frontend/context/UserContext';
import initializeNetwork from './src//backend/utils/logging/initialiseNetworkLog';

const App = () => {
  const [isNetworkInitialized, setNetworkInitialized] = useState(false);

  useEffect(() => {
    const initNetwork = async () => {
      const unsubscribe = await initializeNetwork();
      setNetworkInitialized(true);
      return unsubscribe;
    };

    const unsubscribe = initNetwork();

    return () => {
      unsubscribe.then(fn => fn());
    };
  }, []);

  if (!isNetworkInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <UserProvider>
      <AppNavigation />
      <BackgroundBAC />
      <DbAPI />
    </UserProvider>
  );
};

export default App;

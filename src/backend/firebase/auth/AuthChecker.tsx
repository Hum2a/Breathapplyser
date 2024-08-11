import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as Keychain from 'react-native-keychain';
import AppNavigation from '../../../frontend/components/navigation/navigation';

const AuthChecker: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const token = credentials.password;

          // Optionally: Verify token with your backend
          const response = await fetch('https://yourapi.com/verify-token', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            setInitialRoute('Home'); // User is authenticated
          } else {
            setInitialRoute('Login'); // Token is invalid, go to Login
          }
        } else {
          setInitialRoute('Login'); // No token found, go to Login
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setInitialRoute('Login'); // Default to Login on error
      }
    };

    checkToken();
  }, []);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    ); // Show a loading indicator while checking token
  }

  return <AppNavigation initialRoute={initialRoute} />;
};

export default AuthChecker;

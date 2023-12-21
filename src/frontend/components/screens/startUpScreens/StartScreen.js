import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { StartStyles as styles } from '../../styles/styles';

const StartScreen = ({ navigation }) => {
  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.loginButton]}
        onPress={navigateToLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.registerButton]}
        onPress={navigateToRegister}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartScreen;

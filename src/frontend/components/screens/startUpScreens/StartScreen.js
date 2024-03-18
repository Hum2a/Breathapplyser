import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { StartStyles as styles } from '../../styles/StartUpStyles/startStyles';

const StartScreen = ({ navigation }) => {
  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Breathapplyser</Text>
      <TouchableOpacity onPress={navigateToRegister}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']} // Adjust the colors to fit your theme
          style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToLogin}>
        <LinearGradient
          colors={['#6AE2B8', '#bfe9ff']} // Adjust the colors to fit your theme
          style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default StartScreen;

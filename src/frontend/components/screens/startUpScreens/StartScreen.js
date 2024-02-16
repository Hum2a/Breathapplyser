import React from 'react';
import { View, TouchableOpacity, Text, Animated, Easing, Dimensions, StyleSheet } from 'react-native';
import { StartStyles as styles } from '../../styles/StartUpStyles/startStyles';

const StartScreen = ({ navigation }) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={navigateToRegister}
        style={[
          styles.button,
          styles.registerButton,
          {
            top: windowHeight / 2,
            left: windowWidth / 4,
          },
        ]}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={navigateToLogin}
        style={[
          styles.button,
          styles.loginButton,
          {
            top: windowHeight / 3,
            left: windowWidth / 4,
          },
        ]}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

    </View>
  );
};



export default StartScreen;

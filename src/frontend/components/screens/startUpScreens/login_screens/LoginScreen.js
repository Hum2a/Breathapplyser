import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { LoginStyles } from '../../../styles/StartUpStyles/loginStyles';
import { StartStyles as styles } from '../../../styles/StartUpStyles/startStyles';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('Humzab1711@hotmail.com');
  const [password, setPassword] = useState('testpassword');

  const handleLogin = () => {
    console.log('Attempting to login with Firebase Auth...');
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Login successful:', userCredential);
        navigation.navigate('Home');
      })
      .catch((error) => {
        console.error('Error during login:', error);
      });
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={LoginStyles.container}>
      <Text style={styles.title}>Breathapplyser</Text>
      <TextInput 
        style={LoginStyles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        placeholderTextColor="#999"
      />
      <TextInput 
        style={LoginStyles.input} 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        placeholderTextColor="#999"
      />
      <TouchableOpacity 
        style={LoginStyles.loginButton} // Use this to maintain the touchable area
        onPress={handleLogin}>
        <LinearGradient
          colors={['#6dd5ed', '#2193b0']} // Example gradient colors
          style={LoginStyles.loginButtonGradient}>
          <Text style={LoginStyles.loginButtonText}>Login</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToRegister} style={LoginStyles.loginButton}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']} // Adjust the colors to fit your theme
          style={LoginStyles.loginButtonGradient}>
          <Text style={styles.buttonText}>Register</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

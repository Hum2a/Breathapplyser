// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { LoginStyles } from '../../../styles/StartUpStyles/loginStyles';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('Humzab1711@hotmail.com');
  const [password, setPassword] = useState('testpassword');

  const handleLogin = () => {
    console.log('Attempting to login with Firebase Auth...');
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Login successful:', userCredential);
        // Navigate to the Home screen after successful login
        navigation.navigate('Home');
      })
      .catch((error) => {
        console.error('Error during login:', error);
        // Optionally, update state to show an error message to the user
      });
  };

  return (
    <View style={LoginStyles.container}>
      <TextInput 
        style={LoginStyles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        placeholderTextColor="#999" // Placeholder text color
      />
      <TextInput 
        style={LoginStyles.input} 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        placeholderTextColor="#999" // Placeholder text color
      />
      <TouchableOpacity 
        style={LoginStyles.loginButton} // Stylish login button
        onPress={handleLogin}>
        <Text style={LoginStyles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

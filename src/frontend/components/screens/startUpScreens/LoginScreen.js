// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { LoginStyles } from '../../styles/styles';
import dbURL from '../../../utils/config/dbURL';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Construct the API URL (use your backend server's URL)
      const apiUrl = `${dbURL.serverBaseUrl}/api/login`; // Adjust the IP and port as needed

      // Make an API request to the login endpoint
      const response = await axios.post(apiUrl, {
        usernameOrEmail,
        password
      });

      if (response.status === 200) {
        console.log('LoginScreen.js: Login successful');

        // Save the user data in AsyncStorage or Context (if needed)

        // Navigate to the Home screen after successful login
        navigation.navigate('Home'); // Replace 'Home' with the actual name of your Home screen
      }
    } catch (error) {
      console.error('LoginScreen.js: Error during login:', error);
      // Handle errors (show error message to the user)
    }
  };

  return (
    <View style={LoginStyles.container}>
      <TextInput 
        style={LoginStyles.input} 
        placeholder="Username or Email" 
        value={usernameOrEmail} 
        onChangeText={setUsernameOrEmail} 
      />
      <TextInput 
        style={LoginStyles.input} 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      <TouchableOpacity onPress={handleLogin}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

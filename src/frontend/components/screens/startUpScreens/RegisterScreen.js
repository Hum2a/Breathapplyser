import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { RegisterStyles } from '../../styles/styles';
import { getServerBaseUrl } from '../../../utils/config/dbURL';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('Humza');
  const [email, setEmail] = useState('Humzab1711@hotmail.com');
  const [password, setPassword] = useState('testpassword');

  const handleRegister = async () => {
    try {
      const apiUrl = `${getServerBaseUrl()}/api/register`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('RegisterScreen.js: Registration successful', data);
      navigation.navigate('Login');
    } catch (error) {
      console.error('RegisterScreen.js: Error during registration:', error);
      // Optionally, update state to show an error message to the user
    }
  };

  return (
    <View style={RegisterStyles.container}>
      <TextInput
        style={RegisterStyles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={RegisterStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={RegisterStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleRegister}>
        <Text>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

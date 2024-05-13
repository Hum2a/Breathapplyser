import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { LoginStyles } from '../../../styles/StartUpStyles/loginStyles';
import LinearGradient from 'react-native-linear-gradient';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('Humzab1711@hotmail.com');
  const [password, setPassword] = useState('testpassword');
  const [loginAttempts, setLoginAttempts] = useState(0);

  const handleLogin = () => {
    console.log('Attempting to login with Firebase Auth...');
    const auth = getAuth();
    const maxAttempts = 3; // Maximum number of login attempts

    const attemptSignIn = () => {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log('Login successful:', userCredential);
          // Check if user object is correctly fetched
          if (userCredential.user && userCredential.user.uid) {
            navigation.navigate('Home');
          } else {
            throw new Error("Failed to retrieve user details.");
          }
        })
        .catch((error) => {
          console.error('Error during login:', error);
          if (loginAttempts < maxAttempts) {
            console.log(`Attempt ${loginAttempts + 1} failed, retrying...`);
            setLoginAttempts(loginAttempts + 1);
            attemptSignIn();
          } else {
            console.log('Max login attempts reached, please try again later.');
          }
        });
    };

    attemptSignIn();
  };

  return (
    <View style={LoginStyles.container}>
      <Image style={LoginStyles.logo} source={require('../../../../assets/images/breathapplyser.png')} />
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
        style={LoginStyles.loginButton} 
        onPress={handleLogin}>
        <LinearGradient
          colors={['#6dd5ed', '#2193b0']}
          style={LoginStyles.loginButtonGradient}>
          <Text style={LoginStyles.loginButtonText}>Login</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={LoginStyles.loginButton}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={LoginStyles.loginButtonGradient}>
          <Text style={LoginStyles.loginButtonText}>Register</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

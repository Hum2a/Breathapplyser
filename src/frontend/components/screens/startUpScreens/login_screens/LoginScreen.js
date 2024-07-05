import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { LoginStyles } from '../../../styles/StartUpStyles/loginStyles';
import LinearGradient from 'react-native-linear-gradient';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    console.log('Attempting to login with Firebase Auth...');
    setLoading(true);
    setError('');
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Login successful:', userCredential);
        setLoading(false);
        // Check if user object is correctly fetched
        if (userCredential.user && userCredential.user.uid) {
          navigation.navigate('Home');
        } else {
          throw new Error("Failed to retrieve user details.");
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
        setLoading(false);
        setError('Login failed. Please check your credentials and try again.');
      });
  };

  const handlePasswordReset = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Password Reset', 'A password reset link has been sent to your email address.');
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
        Alert.alert('Error', 'Failed to send password reset email. Please try again.');
      });
  };

  return (
    <View style={LoginStyles.container}>
      <Image style={LoginStyles.logo} source={require('../../../../assets/images/breathapplyserLogo.png')} />
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
      {loading && <ActivityIndicator size="large" color="#2193b0" />}
      {error ? <Text style={LoginStyles.errorText}>{error}</Text> : null}
      <TouchableOpacity 
        style={LoginStyles.loginButton} 
        onPress={handleLogin}
        disabled={loading}
      >
        <LinearGradient
          colors={['#6dd5ed', '#2193b0']}
          style={LoginStyles.loginButtonGradient}>
          <Text style={LoginStyles.loginButtonText}>Login</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePasswordReset} style={LoginStyles.forgotPasswordButton}>
        <Text style={LoginStyles.forgotPasswordText}>Forgot Password?</Text>
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

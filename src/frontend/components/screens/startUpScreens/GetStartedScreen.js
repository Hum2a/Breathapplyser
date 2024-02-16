import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const GetStartedScreen = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.navigate('Register'); // Replace 'Register' with your actual register screen name
  };

  return (
    <TouchableOpacity onPress={handleGetStarted} style={styles.container}>
      <View>
        <Text style={styles.title}>Welcome to Alcoholics Anonymous</Text>
        <Text style={styles.subtitle}>Tap anywhere to Get Started</Text>        
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // You can change the background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 32,
  },
  buttonContainer: {
    backgroundColor: '#007BFF', // Button background color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff', // Button text color
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GetStartedScreen;

// GradientButton.js - Adjustments for circular shape
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={['#6DD5FA', '#2980B9']}
        style={styles.buttonContainer}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 60, // Set width and height to the same value for a circle
    height: 60, // Adjust size as needed
    borderRadius: 30, // Half of width/height to make it a perfect circle
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 12, // Adjust font size to fit the circle
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GradientButton;

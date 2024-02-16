import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import Bubble from '../../animations/bubbles';
import { StartStyles as styles } from '../../styles/StartUpStyles/startStyles';

const StartScreen = ({ navigation }) => {
  const [bubbles, setBubbles] = useState([]);
  const [buttonFloatingAnimation] = useState(new Animated.Value(0)); // Floating animation for buttons
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [showButtons, setShowButtons] = useState(false); // State variable to control button rendering

  const removeBubble = (indexToRemove) => {
    setBubbles((prevBubbles) => prevBubbles.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    setBubbles(generateRandomBubbles());
  }, []);

  useEffect(() => {
    // Start the floating animation for buttons
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonFloatingAnimation, {
          toValue: 1,
          duration: 2000, // Adjust the duration as needed
          easing: Easing.linear,
          useNativeDriver: false, // Set to true for better performance on native platforms
        }),
        Animated.timing(buttonFloatingAnimation, {
          toValue: 0,
          duration: 2000, // Adjust the duration as needed
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Simulate the destruction of initial bubbles after a delay
    const destroyBubblesTimeout = setTimeout(() => {
      setShowButtons(true); // Show the buttons after the initial bubbles are destroyed
    }, 5000); // Adjust the delay as needed

    return () => clearTimeout(destroyBubblesTimeout);
  }, [buttonFloatingAnimation]);

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToHome = () => {
    navigation.navigate('Home2');
  };

  const initialPosition = {
    top: Math.floor(Math.random() * (windowHeight - 100)), // Adjust the range as needed
    left: Math.floor(Math.random() * (windowWidth - 100)), // Adjust the range as needed
  };

  const generateRandomBubbles = () => {
    const bubbleCount = Math.floor(Math.random() * 100) + 50; // generates between 5 to 15 bubbles
    return Array.from({ length: bubbleCount }, (_, index) => (
      <Bubble key={index} removeBubble={() => removeBubble(index)} />
    ));
  };

  return (
    <View style={styles.container}>
      {bubbles}

      {showButtons && ( // Render buttons only when showButtons is true
        <TouchableOpacity
          onPress={navigateToRegister}
          style={[
            styles.button,
            styles.registerButton,
            {
              transform: [
                {
                  translateY: buttonFloatingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 10], // Adjust the floating range as needed
                  }),
                },
              ],
              top: Math.min(
                Math.max(initialPosition.top, 0), // Ensure top is at least 0
                windowHeight - 60 // Ensure top is within the window's height
              ),
              left: Math.min(
                Math.max(initialPosition.left, 0), // Ensure left is at least 0
                windowWidth - 60 // Ensure left is within the window's width
              ),
            },
          ]}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      )}

      {showButtons && ( // Render buttons only when showButtons is true
        <TouchableOpacity
          onPress={navigateToLogin}
          style={[
            styles.button,
            styles.loginButton,
            {
              transform: [
                {
                  translateY: buttonFloatingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 10], // Adjust the floating range as needed
                  }),
                },
              ],
              top: Math.min(
                Math.max(initialPosition.top, 0), // Ensure top is at least 0
                windowHeight - 60 // Ensure top is within the window's height
              ),
              left: Math.min(
                Math.max(initialPosition.left, 0), // Ensure left is at least 0
                windowWidth - 60 // Ensure left is within the window's width
              ),
            },
          ]}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={navigateToHome}
        style={[
          styles.button,
          styles.homeButton,
          {
            transform: [
              {
                translateY: buttonFloatingAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 10], // Adjust the floating range as needed
                }),
              },
            ],
            top: Math.min(
              Math.max(initialPosition.top, 0), // Ensure top is at least 0
              windowHeight - 60 // Ensure top is within the window's height
            ),
            left: Math.min(
              Math.max(initialPosition.left, 0), // Ensure left is at least 0
              windowWidth - 60 // Ensure left is within the window's width
            ),
          },
        ]}
      >
        <Text style={styles.buttonText}>Home 2</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartScreen;

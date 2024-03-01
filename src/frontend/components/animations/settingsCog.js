import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const SpinningCog = () => {
  // This animated value will be used to drive the rotation
  const spinValue = useRef(new Animated.Value(0)).current;

  // Set up the animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1, // Rotate from 0 to 1 (full rotation)
        duration: 2000, // Duration of one full rotation
        easing: Easing.linear, // Linear easing for constant speed
        useNativeDriver: true, // Use native driver for better performance
      })
    ).start();
  }, [spinValue]);

  // Interpolate the animated value to map to 0 - 360 degrees rotation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/images/gear.png')} // Replace with the correct path
        style={[styles.cog, { transform: [{ rotate: spin }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cog: {
    width: 50, // Set the size of the cog
    height: 50, // Set the size of the cog
  },
});

export default SpinningCog;

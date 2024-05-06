import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const SpinningCog = ({ play }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation;
    if (play) {
      animation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,  // Complete a full rotation
          duration: 3000,  // Duration of one rotation
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animation.start();
    } else {
      spinValue.stopAnimation();
    }

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [play, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/images/cog.png')}
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
    width: 40,
    height: 40,
  },
});

export default SpinningCog;

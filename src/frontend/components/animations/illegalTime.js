import { Animated } from 'react-native';

export const useShakeAnimation = () => {
  const shakeAnimation = new Animated.Value(0);

  const runShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return { shakeAnimation, runShakeAnimation };
};

export const useColourFlashAnimation = () => {
  const colorAnimation = new Animated.Value(0);

  const runColourFlashAnimation = () => {
    Animated.sequence([
      Animated.timing(colorAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(colorAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return { colorAnimation, runColourFlashAnimation };
};

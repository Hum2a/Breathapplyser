import React, { useRef } from 'react';
import { Animated, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';

export const AnimatedButton = ({ title, style, textStyle, onPress }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 1.1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleValue }] }]}>
        <Text style={textStyle}>{title}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

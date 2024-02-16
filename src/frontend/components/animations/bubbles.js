import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image } from 'react-native';

const Bubble = ({ removeBubble }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const angle = useRef(0); // Angle in radians
  const xPos = useRef(new Animated.Value(0)).current;
  const yPos = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const maxDistance = Math.sqrt(Math.pow(windowWidth, 2) + Math.pow(windowHeight, 2)) / 2;

  // Generate random initial values
  const initialAngle = Math.random() * 2 * Math.PI; // Random angle between 0 and 2π
  const initialSpeed = Math.random() * 2 + 1; // Initial random speed
  const acceleration = 0.1; // Acceleration rate
  let speed = initialSpeed; // Current speed, starting from initialSpeed
  const direction = Math.random() > 0.5 ? 1 : -1; // Random direction (1 for CW, -1 for CCW)

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    const interval = setInterval(() => {
      angle.current += direction * speed; // Update angle based on current speed and direction
      speed += acceleration; // Increase speed

      const radius = Math.min(angle.current * 5, maxDistance);

      // Update positions
      xPos.setValue(radius * Math.cos(angle.current + initialAngle));
      yPos.setValue(radius * Math.sin(angle.current + initialAngle));

      // Check if the bubble has gone off-screen
      if (radius >= maxDistance) {
        clearInterval(interval);
        removeBubble(); // Remove the bubble from rendering
      }
    }, 100);

    return () => clearInterval(interval);
  }, [removeBubble]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        transform: [
          { translateX: xPos },
          { translateY: yPos },
          { scale: scale },
        ],
      }}
    >
      <Image
        source={require('../../assets/images/Bubble.png')}
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
    </Animated.View>
  );
};

export default Bubble;

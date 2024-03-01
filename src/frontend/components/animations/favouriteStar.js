import React, { useState, useEffect, useRef } from 'react';
import { Image } from 'react-native';
import { homeStyles } from '../styles/StartUpStyles/homeStyles';
import FastImage from 'react-native-fast-image';

// Pre-filled array with the required frame images
const frames = [
  require('../../assets/animations/starFrames/frame_1.png'),
  require('../../assets/animations/starFrames/frame_2.png'),
  require('../../assets/animations/starFrames/frame_3.png'),
  require('../../assets/animations/starFrames/frame_4.png'),
  require('../../assets/animations/starFrames/frame_5.png'),
  require('../../assets/animations/starFrames/frame_6.png'),
  require('../../assets/animations/starFrames/frame_7.png'),
  require('../../assets/animations/starFrames/frame_8.png'),
  require('../../assets/animations/starFrames/frame_9.png'),
  require('../../assets/animations/starFrames/frame_10.png'),
  require('../../assets/animations/starFrames/frame_11.png'),
  require('../../assets/animations/starFrames/frame_12.png'),
  require('../../assets/animations/starFrames/frame_13.png'),
  require('../../assets/animations/starFrames/frame_14.png'),
  require('../../assets/animations/starFrames/frame_15.png'),
  require('../../assets/animations/starFrames/frame_16.png'),
  require('../../assets/animations/starFrames/frame_17.png'),
  require('../../assets/animations/starFrames/frame_18.png'),
  require('../../assets/animations/starFrames/frame_19.png'),
  require('../../assets/animations/starFrames/frame_20.png'),

];

const StarAnimation = ({ frameRate, play, onComplete }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationRef = useRef({});

  useEffect(() => {
    if (play) {
      animationRef.current.interval = setInterval(() => {
        setCurrentFrame(prevCurrentFrame => {
          const nextFrame = prevCurrentFrame + 1;
          if (nextFrame < frames.length) {
            return nextFrame;
          } else {
            clearInterval(animationRef.current.interval);
            if (onComplete) {
              // Ensure onComplete is called outside the render phase
              setTimeout(onComplete, 0);
            }
            return prevCurrentFrame; // Keep showing the last frame
          }
        });
      }, 1000 / frameRate);
    } else {
      setCurrentFrame(0); // Reset to the first frame when not playing
    }

    // Cleanup interval on component unmount or when play changes
    return () => clearInterval(animationRef.current.interval);
  }, [play, frameRate, onComplete]);

  return (
    <FastImage
      source={frames[currentFrame]}
      style={homeStyles.smallIcon}
    />
  );
};

export default StarAnimation;

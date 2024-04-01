import React, { useState, useEffect, useRef } from 'react';
import { Image } from 'react-native';
import { homeStyles } from '../styles/StartUpStyles/homeStyles';
import FastImage from 'react-native-fast-image';

// Pre-filled array with the required frame images
const frames = [
  require('../../assets/animations/muscleManFrames/frame_1.png'),
  require('../../assets/animations/muscleManFrames/frame_2.png'),
  require('../../assets/animations/muscleManFrames/frame_3.png'),
  require('../../assets/animations/muscleManFrames/frame_4.png'),
  require('../../assets/animations/muscleManFrames/frame_5.png'),
  require('../../assets/animations/muscleManFrames/frame_6.png'),
  require('../../assets/animations/muscleManFrames/frame_7.png'),
  require('../../assets/animations/muscleManFrames/frame_8.png'),
  require('../../assets/animations/muscleManFrames/frame_9.png'),
  require('../../assets/animations/muscleManFrames/frame_10.png'),
  require('../../assets/animations/muscleManFrames/frame_11.png'),
  require('../../assets/animations/muscleManFrames/frame_12.png'),
  require('../../assets/animations/muscleManFrames/frame_13.png'),
  require('../../assets/animations/muscleManFrames/frame_14.png'),
  require('../../assets/animations/muscleManFrames/frame_15.png'),
  require('../../assets/animations/muscleManFrames/frame_16.png'),
  require('../../assets/animations/muscleManFrames/frame_17.png'),
  require('../../assets/animations/muscleManFrames/frame_18.png'),
  require('../../assets/animations/muscleManFrames/frame_19.png'),
  require('../../assets/animations/muscleManFrames/frame_20.png'),
  require('../../assets/animations/muscleManFrames/frame_21.png'),
  require('../../assets/animations/muscleManFrames/frame_22.png'),
  require('../../assets/animations/muscleManFrames/frame_23.png'),
  require('../../assets/animations/muscleManFrames/frame_24.png'),
  require('../../assets/animations/muscleManFrames/frame_25.png'),
  require('../../assets/animations/muscleManFrames/frame_26.png'),
  require('../../assets/animations/muscleManFrames/frame_27.png'),
  require('../../assets/animations/muscleManFrames/frame_28.png'),
  require('../../assets/animations/muscleManFrames/frame_29.png'),
  require('../../assets/animations/muscleManFrames/frame_30.png'),

];

const MuscleManAnimation = ({ frameRate, play, onComplete }) => {
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

export default MuscleManAnimation;

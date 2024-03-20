import React, { useState, useEffect, useRef } from 'react';
import FastImage from 'react-native-fast-image';
import { SettingStyles } from '../styles/SettingStyles/settingStyles';

// Pre-filled array with the required frame images
const frames = [
  require('../../assets/animations/profileWaveFrames/frame_1.png'),
  require('../../assets/animations/profileWaveFrames/frame_2.png'),
  require('../../assets/animations/profileWaveFrames/frame_3.png'),
  require('../../assets/animations/profileWaveFrames/frame_4.png'),
  require('../../assets/animations/profileWaveFrames/frame_5.png'),
  require('../../assets/animations/profileWaveFrames/frame_6.png'),
  require('../../assets/animations/profileWaveFrames/frame_7.png'),
  require('../../assets/animations/profileWaveFrames/frame_8.png'),
  require('../../assets/animations/profileWaveFrames/frame_9.png'),
  require('../../assets/animations/profileWaveFrames/frame_10.png'),
  require('../../assets/animations/profileWaveFrames/frame_11.png'),
  require('../../assets/animations/profileWaveFrames/frame_12.png'),
  require('../../assets/animations/profileWaveFrames/frame_13.png'),
  require('../../assets/animations/profileWaveFrames/frame_14.png'),
  require('../../assets/animations/profileWaveFrames/frame_15.png'),
  require('../../assets/animations/profileWaveFrames/frame_16.png'),
  require('../../assets/animations/profileWaveFrames/frame_17.png'),
  require('../../assets/animations/profileWaveFrames/frame_18.png'),
  require('../../assets/animations/profileWaveFrames/frame_19.png'),
  require('../../assets/animations/profileWaveFrames/frame_20.png'),
  require('../../assets/animations/profileWaveFrames/frame_21.png'),
  require('../../assets/animations/profileWaveFrames/frame_22.png'),
  require('../../assets/animations/profileWaveFrames/frame_23.png'),
  require('../../assets/animations/profileWaveFrames/frame_24.png'),
  require('../../assets/animations/profileWaveFrames/frame_25.png'),
  require('../../assets/animations/profileWaveFrames/frame_26.png'),
  require('../../assets/animations/profileWaveFrames/frame_27.png'),
  require('../../assets/animations/profileWaveFrames/frame_28.png'),
  require('../../assets/animations/profileWaveFrames/frame_29.png'),
  require('../../assets/animations/profileWaveFrames/frame_30.png'),

];

const ProfileWaveAnimation = ({ frameRate, play, onComplete }) => {
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
      style={SettingStyles.icon}
    />
  );
};

export default ProfileWaveAnimation;

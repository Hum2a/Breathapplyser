import React, { useState, useEffect, useRef } from 'react';
import { Image } from 'react-native';
import { homeStyles } from '../styles/StartUpStyles/homeStyles';
import FastImage from 'react-native-fast-image';

// Pre-filled array with the required frame images
const frames = [
  require('../../assets/animations/paintRollerFrames/frame_1.png'),
  require('../../assets/animations/paintRollerFrames/frame_2.png'),
  require('../../assets/animations/paintRollerFrames/frame_3.png'),
  require('../../assets/animations/paintRollerFrames/frame_4.png'),
  require('../../assets/animations/paintRollerFrames/frame_5.png'),
  require('../../assets/animations/paintRollerFrames/frame_6.png'),
  require('../../assets/animations/paintRollerFrames/frame_7.png'),
  require('../../assets/animations/paintRollerFrames/frame_8.png'),
  require('../../assets/animations/paintRollerFrames/frame_9.png'),
  require('../../assets/animations/paintRollerFrames/frame_10.png'),
  require('../../assets/animations/paintRollerFrames/frame_11.png'),
  require('../../assets/animations/paintRollerFrames/frame_12.png'),
  require('../../assets/animations/paintRollerFrames/frame_13.png'),
  require('../../assets/animations/paintRollerFrames/frame_14.png'),
  require('../../assets/animations/paintRollerFrames/frame_15.png'),
  require('../../assets/animations/paintRollerFrames/frame_16.png'),
  require('../../assets/animations/paintRollerFrames/frame_17.png'),
  require('../../assets/animations/paintRollerFrames/frame_18.png'),
  require('../../assets/animations/paintRollerFrames/frame_19.png'),
  require('../../assets/animations/paintRollerFrames/frame_20.png'),
  require('../../assets/animations/paintRollerFrames/frame_21.png'),
  require('../../assets/animations/paintRollerFrames/frame_22.png'),
  require('../../assets/animations/paintRollerFrames/frame_23.png'),
  require('../../assets/animations/paintRollerFrames/frame_24.png'),
  require('../../assets/animations/paintRollerFrames/frame_25.png'),
  require('../../assets/animations/paintRollerFrames/frame_26.png'),
  require('../../assets/animations/paintRollerFrames/frame_27.png'),
  require('../../assets/animations/paintRollerFrames/frame_28.png'),
  require('../../assets/animations/paintRollerFrames/frame_29.png'),
  require('../../assets/animations/paintRollerFrames/frame_30.png'),
  require('../../assets/animations/paintRollerFrames/frame_31.png'),
  require('../../assets/animations/paintRollerFrames/frame_32.png'),
  require('../../assets/animations/paintRollerFrames/frame_33.png'),
  require('../../assets/animations/paintRollerFrames/frame_34.png'),
  require('../../assets/animations/paintRollerFrames/frame_35.png'),
  require('../../assets/animations/paintRollerFrames/frame_36.png'),
  require('../../assets/animations/paintRollerFrames/frame_37.png'),
  require('../../assets/animations/paintRollerFrames/frame_38.png'),
  require('../../assets/animations/paintRollerFrames/frame_39.png'),
  require('../../assets/animations/paintRollerFrames/frame_40.png'),
  require('../../assets/animations/paintRollerFrames/frame_41.png'),
];

const PaintRollerAnimation = ({ frameRate, play, onComplete }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationRef = useRef({});

  useEffect(() => {
    if (play) {
        // Set up the interval to change frames
        animationRef.current.interval = setInterval(() => {
            setCurrentFrame(prevCurrentFrame => {
                const nextFrame = prevCurrentFrame + 1;
                if (nextFrame < frames.length) {
                    return nextFrame;  // Move to the next frame
                } else {
                    return 0;  // Reset to the first frame to loop the animation
                }
            });
        }, 1000 / frameRate);  // Calculate interval time based on the desired frame rate
    } else {
        // Clear the interval and reset the frame if 'play' is set to false
        clearInterval(animationRef.current.interval);
        setCurrentFrame(0);  // Reset to the first frame when not playing
    }

    // Clean up the interval when the component unmounts or when 'play' or 'frameRate' changes
    return () => {
        clearInterval(animationRef.current.interval);
    };
}, [play, frameRate]);


  return (
    <FastImage
      source={frames[currentFrame]}
      style={homeStyles.smallIcon}
    />
  );
};

export default PaintRollerAnimation;

import React, { useState, useEffect, useRef } from 'react';
import { Image } from 'react-native';
import { homeStyles } from '../styles/StartUpStyles/homeStyles';
import FastImage from 'react-native-fast-image';

// Pre-filled array with the required frame images
const frames = [
  require('../../assets/animations/penwritingFrames/frame_1.png'),
  require('../../assets/animations/penwritingFrames/frame_2.png'),
  require('../../assets/animations/penwritingFrames/frame_3.png'),
  require('../../assets/animations/penwritingFrames/frame_4.png'),
  require('../../assets/animations/penwritingFrames/frame_5.png'),
  require('../../assets/animations/penwritingFrames/frame_6.png'),
  require('../../assets/animations/penwritingFrames/frame_7.png'),
  require('../../assets/animations/penwritingFrames/frame_8.png'),
  require('../../assets/animations/penwritingFrames/frame_9.png'),
  require('../../assets/animations/penwritingFrames/frame_10.png'),
  require('../../assets/animations/penwritingFrames/frame_11.png'),
  require('../../assets/animations/penwritingFrames/frame_12.png'),
  require('../../assets/animations/penwritingFrames/frame_13.png'),
  require('../../assets/animations/penwritingFrames/frame_14.png'),
  require('../../assets/animations/penwritingFrames/frame_15.png'),
  require('../../assets/animations/penwritingFrames/frame_16.png'),
  require('../../assets/animations/penwritingFrames/frame_17.png'),
  require('../../assets/animations/penwritingFrames/frame_18.png'),
  require('../../assets/animations/penwritingFrames/frame_19.png'),
  require('../../assets/animations/penwritingFrames/frame_20.png'),
  require('../../assets/animations/penwritingFrames/frame_21.png'),
];

const PenWritingAnimation = ({ frameRate, play, onComplete }) => {
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

export default PenWritingAnimation;
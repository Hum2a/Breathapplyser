import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { homeStyles } from '../styles/StartUpStyles/homeStyles';

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

const StarAnimation = ({ frameRate, play }) => {
    const [currentFrame, setCurrentFrame] = useState(0);
  
    useEffect(() => {
      let interval;
      if (play) {
        interval = setInterval(() => {
          setCurrentFrame(prevCurrentFrame => {
            // Check if we've reached the last frame. If so, do not increment.
            if (prevCurrentFrame < frames.length - 1) {
              return prevCurrentFrame + 1;
            } else {
              // Once the last frame is reached, stop the interval and hold on the last frame
              clearInterval(interval);
              return prevCurrentFrame;
            }
          });
        }, 1000 / frameRate);
      } else {
        // Optionally, you could also decide to reset to the first frame or hold the last frame when stopped
        setCurrentFrame(0); // Reset to first frame when not playing
        // setCurrentFrame(frames.length - 1); // Uncomment to hold the last frame when not playing
      }
      return () => clearInterval(interval);
    }, [play, frameRate]);
  
    return (
      <Image source={frames[currentFrame]} style={homeStyles.smallIcon} />
    );
};

export default StarAnimation;
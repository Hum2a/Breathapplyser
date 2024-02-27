import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { homeStyles } from '../styles/StartUpStyles/homeStyles';

// Pre-filled array with the required frame images
const frames = [
  require('../../assets/animations/beerFrames/frame_1.png'),
  require('../../assets/animations/beerFrames/frame_2.png'),
  require('../../assets/animations/beerFrames/frame_3.png'),
  require('../../assets/animations/beerFrames/frame_4.png'),
  require('../../assets/animations/beerFrames/frame_5.png'),
  require('../../assets/animations/beerFrames/frame_6.png'),
  require('../../assets/animations/beerFrames/frame_7.png'),
  require('../../assets/animations/beerFrames/frame_8.png'),
  require('../../assets/animations/beerFrames/frame_9.png'),
  require('../../assets/animations/beerFrames/frame_10.png'),
  require('../../assets/animations/beerFrames/frame_11.png'),
  require('../../assets/animations/beerFrames/frame_12.png'),
  require('../../assets/animations/beerFrames/frame_13.png'),
  require('../../assets/animations/beerFrames/frame_14.png'),
  require('../../assets/animations/beerFrames/frame_15.png'),
  require('../../assets/animations/beerFrames/frame_16.png'),
  require('../../assets/animations/beerFrames/frame_17.png'),
  require('../../assets/animations/beerFrames/frame_18.png'),
  require('../../assets/animations/beerFrames/frame_19.png'),
  require('../../assets/animations/beerFrames/frame_20.png'),
  require('../../assets/animations/beerFrames/frame_21.png'),
  require('../../assets/animations/beerFrames/frame_22.png'),
  require('../../assets/animations/beerFrames/frame_23.png'),
  require('../../assets/animations/beerFrames/frame_24.png'),
  require('../../assets/animations/beerFrames/frame_25.png'),

];

const BeerAnimation = ({ frameRate, play }) => {
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
      <Image source={frames[currentFrame]} style={homeStyles.beer} />
    );
};

export default BeerAnimation;
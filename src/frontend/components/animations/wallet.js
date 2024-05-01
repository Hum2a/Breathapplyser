import React, { useState, useEffect, useRef } from 'react';
import { Image } from 'react-native';
import { homeStyles } from '../styles/StartUpStyles/homeStyles';
import FastImage from 'react-native-fast-image';

// Pre-filled array with the required frame images
const frames = [
  require('../../assets/animations/walletFrames/frame_1.png'),
  require('../../assets/animations/walletFrames/frame_2.png'),
  require('../../assets/animations/walletFrames/frame_3.png'),
  require('../../assets/animations/walletFrames/frame_4.png'),
  require('../../assets/animations/walletFrames/frame_5.png'),
  require('../../assets/animations/walletFrames/frame_6.png'),
  require('../../assets/animations/walletFrames/frame_7.png'),
  require('../../assets/animations/walletFrames/frame_8.png'),
  require('../../assets/animations/walletFrames/frame_9.png'),
  require('../../assets/animations/walletFrames/frame_10.png'),
  require('../../assets/animations/walletFrames/frame_11.png'),
  require('../../assets/animations/walletFrames/frame_12.png'),
  require('../../assets/animations/walletFrames/frame_13.png'),
  require('../../assets/animations/walletFrames/frame_14.png'),
  require('../../assets/animations/walletFrames/frame_15.png'),
  require('../../assets/animations/walletFrames/frame_16.png'),
  require('../../assets/animations/walletFrames/frame_17.png'),
  require('../../assets/animations/walletFrames/frame_18.png'),
  require('../../assets/animations/walletFrames/frame_19.png'),
  require('../../assets/animations/walletFrames/frame_20.png'),
  require('../../assets/animations/walletFrames/frame_21.png'),
  require('../../assets/animations/walletFrames/frame_22.png'),
  require('../../assets/animations/walletFrames/frame_23.png'),
  require('../../assets/animations/walletFrames/frame_24.png'),
  require('../../assets/animations/walletFrames/frame_25.png'),
  require('../../assets/animations/walletFrames/frame_26.png'),
  require('../../assets/animations/walletFrames/frame_27.png'),
  require('../../assets/animations/walletFrames/frame_28.png'),
  require('../../assets/animations/walletFrames/frame_29.png'),
  require('../../assets/animations/walletFrames/frame_30.png'),
  require('../../assets/animations/walletFrames/frame_31.png'),
  require('../../assets/animations/walletFrames/frame_32.png'),
  require('../../assets/animations/walletFrames/frame_33.png'),
  require('../../assets/animations/walletFrames/frame_34.png'),
  require('../../assets/animations/walletFrames/frame_35.png'),
  require('../../assets/animations/walletFrames/frame_36.png'),
  require('../../assets/animations/walletFrames/frame_37.png'),
  require('../../assets/animations/walletFrames/frame_38.png'),
  require('../../assets/animations/walletFrames/frame_39.png'),
  require('../../assets/animations/walletFrames/frame_40.png'),
  require('../../assets/animations/walletFrames/frame_41.png'),
];

const WalletAnimation = ({ frameRate, play, onComplete }) => {
  const [currentFrame, setCurrentFrame] = useState(1);
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
      style={homeStyles.wallet}
    />
  );
};

export default WalletAnimation;

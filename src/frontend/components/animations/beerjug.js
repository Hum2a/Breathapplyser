import React, { useState, useEffect, useContext, useRef } from 'react';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import FastImage from 'react-native-fast-image';
import { homeStyles } from '../styles/StartUpStyles/homeStyles';
import { UserContext } from '../../context/UserContext';
import moment from 'moment';

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

const BeerAnimation = ({ frameRate, play, onComplete }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [standbyFrame, setStandbyFrame] = useState(0);
  const animationRef = useRef({});
  const [drinkingLimit, setDrinkingLimit] = useState(null);
  const [currentConsumption, setCurrentConsumption] = useState(0);
  const { user } = useContext(UserContext);
  const firestore = getFirestore();

  useEffect(() => {
    const today = moment().format('YYYY-MM-DD');
    const limitDocRef = doc(firestore, `${user.uid}/Limits`);
    const intakeDocRef = doc(firestore, `${user.uid}/Daily Totals/Unit Intake`, today);

    // Fetch the drinking limit
    const unsubscribeLimit = onSnapshot(limitDocRef, (doc) => {
      if (doc.exists()) {
        setDrinkingLimit(doc.data().drinkingLimit || 0);
      }
    });

    // Listen for real-time updates on current consumption
    const unsubscribeConsumption = onSnapshot(intakeDocRef, (doc) => {
      if (doc.exists()) {
        setCurrentConsumption(doc.data().value || 0);
      }
    });

    return () => {
      unsubscribeLimit();
      unsubscribeConsumption();
    };
  }, [user.uid]);

  useEffect(() => {
    if (drinkingLimit !== null && currentConsumption !== null) { 
      const percentageOfLimit = currentConsumption / drinkingLimit;
      let frame = 0; // Default frame
      if (percentageOfLimit >= 1) {
        frame = 24;
      } else if (percentageOfLimit >= 0.75) {
        frame = 16;
      } else if (percentageOfLimit >= 0.5) {
        frame = 12;
      } else if (percentageOfLimit >= 0.25) {
        frame = 5;
      }
      setCurrentFrame(frame);
    }
  }, [currentConsumption, drinkingLimit]);


  useEffect(() => {
    if (play) {
        // Set up the interval to change frames
        animationRef.current.interval = setInterval(() => {
            setCurrentFrame(prevCurrentFrame => {
              const nextFrame = prevCurrentFrame + 1;
              return nextFrame < frames.length ? nextFrame : 0;
            });
        }, 1000 / frameRate);  // Calculate interval time based on the desired frame rate
    } else {
        // Clear the interval and reset the frame if 'play' is set to false
        clearInterval(animationRef.current.interval);

    }

    // Clean up the interval when the component unmounts or when 'play' or 'frameRate' changes
    return () => {
        clearInterval(animationRef.current.interval);
    };
}, [play, frameRate]);


  return (
    <FastImage
      source={frames[currentFrame]}
      style={homeStyles.beer}
    />
  );
};

export default BeerAnimation;

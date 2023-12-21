import React, { useEffect } from 'react';
import { globalData } from '../database';

const decreasePerSecond = 0.015 / 3600;

export const calculateBAC = (previousBAC, elapsedSeconds) => {
  const decrease = decreasePerSecond * elapsedSeconds;
  const currentBAC = Math.max(previousBAC - decrease, 0);
  return currentBAC;
};

const BackgroundBAC = () => {
  useEffect(() => {
    const timerInterval = 1000; // 1 second interval
    let previousBAC = globalData.globalBAC;
    
    const backgroundTimer = setInterval(() => {
      // Calculate the elapsed time since the last update
      const elapsedSeconds = timerInterval / 1000;

      // Calculate the new BAC value
      const currentBAC = calculateBAC(previousBAC, elapsedSeconds);

      // Update the global BAC value
      globalData.globalBAC = currentBAC;

      // Update the previous BAC for the next calculation
      previousBAC = currentBAC;
    }, timerInterval);

    return () => {
      clearInterval(backgroundTimer);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default BackgroundBAC;

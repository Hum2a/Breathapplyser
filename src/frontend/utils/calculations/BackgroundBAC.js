import React, { useEffect } from 'react';
import { globalData } from '../database';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';

const decreasePerSecond = 0.015 / 3600;

export const calculateBAC = (previousBAC, elapsedSeconds) => {
  const decrease = decreasePerSecond * elapsedSeconds;
  const currentBAC = Math.max(previousBAC - decrease, 0);
  return currentBAC;
};

const BackgroundBAC = () => {
  const firestore = getFirestore();

  useEffect(() => {
    const fetchEntries = async () => {
      const q = query(collection(firestore, "entries"), orderBy("dateTime", "desc"));
      const querySnapshot = await getDocs(q);
      const entries = querySnapshot.docs.map(doc => doc.data());

      // Assume entries are sorted by dateTime in descending order
      // Use the most recent entry's BAC as the starting point
      const latestEntry = entries[0];
      let previousBAC = latestEntry ? latestEntry.BAC : 0;

      const backgroundTimer = setInterval(() => {
        const elapsedSeconds = 1;
        const currentBAC = calculateBAC(previousBAC, elapsedSeconds);
        previousBAC = currentBAC;
      }, 1000);

      return () => clearInterval(backgroundTimer);
    };

    fetchEntries();
  }, []);

//   useEffect(() => {
//     const timerInterval = 1000; // 1 second interval
//     let previousBAC = globalData.globalBAC;
    
//     const backgroundTimer = setInterval(() => {
//       // Calculate the elapsed time since the last update
//       const elapsedSeconds = timerInterval / 1000;

//       // Calculate the new BAC value
//       const currentBAC = calculateBAC(previousBAC, elapsedSeconds);

//       // Update the global BAC value
//       globalData.globalBAC = currentBAC;

//       // Update the previous BAC for the next calculation
//       previousBAC = currentBAC;
//     }, timerInterval);

//     return () => {
//       clearInterval(backgroundTimer);
//     };
//   }, []);

//   return null; // This component doesn't render anything
};


export default BackgroundBAC;
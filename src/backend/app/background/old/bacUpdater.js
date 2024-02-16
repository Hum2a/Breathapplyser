import { useEffect, useState } from 'react';
import { calculateBACDrop } from '../../utils/calculations/bacCalculation';
import { postBACUpdate } from '../../../firebase/queries/postBACUpdate';
import { setupBACListener } from './bacListener';
import { getAuth } from 'firebase/auth';

export const useBACUpdater = () => {
  const [currentBAC, setCurrentBAC] = useState(0);
  const userUID = getAuth().currentUser?.uid;

  useEffect(() => {
    if (userUID) {
      setupBACListener(setCurrentBAC); // Setup real-time listener

      const interval = setInterval(async () => {
        const updatedBAC = await calculateBACDrop();
        setCurrentBAC(updatedBAC);
        postBACUpdate(userUID, updatedBAC); // Post updated BAC to Firestore
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [userUID]);

  return currentBAC;
};

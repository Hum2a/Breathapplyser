import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import moment from 'moment';
import { useContext } from 'react';
import { UserContext } from '../../../../frontend/context/UserContext';

const firestore = getFirestore();
const BAC_DECAY_RATE_PER_SECOND = 0.015 / 3600; // Standard BAC decay rate per second
const { user } = useContext(UserContext);

export const calculateBACDrop = async () => {
  const bacQuery = query(collection(firestore, user.uid, "Alcohol Stuff", "BAC Level"), orderBy("timestamp", "desc"), limit(1));
  const querySnapshot = await getDocs(bacQuery);

  if (!querySnapshot.empty) {
    const latestDoc = querySnapshot.docs[0];
    const latestBACData = latestDoc.data();
    const lastTimestamp = latestBACData.timestamp.toDate();
    const currentTimestamp = new Date();
    const timeDiffSeconds = (currentTimestamp - lastTimestamp) / 1000;

    // Calculate the decrease in BAC
    return Math.max(latestBACData.currentBAC - timeDiffSeconds * BAC_DECAY_RATE_PER_SECOND, 0);
  }
  return 0;
};

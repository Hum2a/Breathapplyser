import { useContext } from 'react';
import { collection, query, orderBy, getDocs, getFirestore, doc, setDoc, limit } from 'firebase/firestore';
import moment from 'moment';
import { UserContext } from '../../../../frontend/context/UserContext';

const firestore = getFirestore();
const { user } = useContext(UserContext);

export const calculateAndRecordCurrentBAC = async (userUID) => {
  const latestBACQuery = query(collection(firestore, user.uid, "Alcohol Stuff", "BAC Level"), orderBy("timestamp", "desc"), limit(1));
  const latestSnapshot = await getDocs(latestBACQuery);

  if (latestSnapshot.empty) return;

  const latestBAC = latestSnapshot.docs[0].data().currentBAC;
  const lastTimestamp = latestSnapshot.docs[0].data().timestamp.toDate();
  const currentTimestamp = new Date();
  const timeDiff = (currentTimestamp - lastTimestamp) / 1000; // Time difference in seconds

  // Calculate the decrease in BAC
  const decreaseAmount = 0.015 / 3600 * timeDiff;
  const updatedBAC = Math.max(latestBAC - decreaseAmount, 0);

  // Create a custom document ID with date, time, and user UID
  const dateTimeString = moment().format('YYYYMMDD_HHmmss');
  const customDocId = `BAC_auto_${dateTimeString}_${userUID}`;

  // Add a new document with the updated BAC level
  await setDoc(doc(firestore, "BAC Level", customDocId), {
    currentBAC: updatedBAC,
    timestamp: currentTimestamp
  });

  return updatedBAC;
};

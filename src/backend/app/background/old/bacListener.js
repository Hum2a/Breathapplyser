import { getFirestore, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../../../../frontend/context/UserContext';

const firestore = getFirestore();
const { user } = useContext(UserContext);

export const setupBACListener = (setCurrentBAC) => {
  const bacQuery = query(collection(firestore, user.uid, "Alcohol Stuff", "BAC Level"), orderBy("timestamp", "desc"), limit(1));
  
  const unsubscribe = onSnapshot(bacQuery, (querySnapshot) => {
    const latestDoc = querySnapshot.docs[0];
    if (latestDoc) {
      const data = latestDoc.data();
      setCurrentBAC(data.currentBAC); // Assuming 'currentBAC' is the field storing BAC level
    }
  });

  return unsubscribe;
};

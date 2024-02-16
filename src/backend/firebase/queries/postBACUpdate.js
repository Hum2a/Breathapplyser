import { doc, setDoc, getFirestore } from 'firebase/firestore';
import moment from 'moment';
import { useContext } from 'react';
import { UserContext } from '../../../frontend/context/UserContext';

const firestore = getFirestore();
const { user } = useContext(UserContext);

export const postBACUpdate = async (userUID, currentBAC) => {
  const dateTimeString = moment().format('YYYYMMDD_HHmmss');
  const customDocId = `BAC_auto_${dateTimeString}_${userUID}`;

  const BACLevelEntry = {
    currentBAC: currentBAC,
    date: new Date()
  };

  await setDoc(doc(firestore, user.uid, "Alcohol Stuff", "BAC Level", customDocId), BACLevelEntry);
};

import { getFirestore, doc, setDoc, collection, addDoc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import calculateBACIncrease from '../../../frontend/utils/calculations/calculateBAC';

const firestore = getFirestore();

export const saveEntry = async (user, userProfile, entryDetails) => {
  const { alcohol, amount, units, price, type, selectedStartTime, selectedEndTime, selectedDate, selectedCurrency } = entryDetails;

  if (!user) {
    console.error("User data is not available");
    return;
  }

  const entryDoc = {
    user_id: user.uid,
    alcohol,
    amount: parseInt(amount),
    units: parseFloat(units),
    price: parseFloat(price),
    selectedCurrency,
    type,
    startTime: moment(selectedStartTime, 'HH:mm').toISOString(),
    endTime: moment(selectedEndTime, 'HH:mm').toISOString(),
    BACIncrease: calculateBACIncrease(units, userProfile),
    date: selectedDate,
    timestamp: new Date(), // Current date and time
  };

  const dateStr = moment(selectedDate).format('YYYY-MM-DD'); // Format date as YYYY-MM-DD
  const entryDocId = moment().format('YYYYMMDD_HHmmss'); // Use a unique ID for each entry

  try {
    // Add or update a field in the dateStr document
    const dateStrDocRef = doc(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr);
    await setDoc(dateStrDocRef, { lastUpdated: new Date() }, { merge: true });

    // Create a nested structure for the entry document
    await setDoc(doc(dateStrDocRef, "EntryDocs", entryDocId), entryDoc);
    console.log('Entry saved successfully');
  } catch (error) {
    console.error('Error saving entry:', error);
  }
};

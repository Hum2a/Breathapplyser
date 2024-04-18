import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import moment from 'moment';
import calculateBACIncrease from '../../../frontend/utils/calculations/calculateBAC';
import { bacLabels } from '../../app/background/Drunkness/BACLabels';
import { getDrunkennessLevel } from '../../app/background/Drunkness/drunknessCalculator';

const firestore = getFirestore();

export const saveEntry = async (user, userProfile, entryDetails) => {
  const { alcohol, amount, units, price, type, calories, selectedStartTime, selectedEndTime, selectedDate, selectedCurrency } = entryDetails;

  if (!user) {
    console.error("User data is not available");
    return;
  }

  // Calculate BAC increase
  const BACIncrease = calculateBACIncrease(units, userProfile);

  // Get total BAC level for the selected date
  const dateStr = moment(selectedDate).format('YYYY-MM-DD');
  const bacLevelRef = doc(firestore, user.uid, "Daily Totals", "BAC Level", dateStr);
  let drunknessLevel = 'Sober'; // Default drunkness level

  try {
    const bacLevelDoc = await getDoc(bacLevelRef);
    let totalBACLevel = bacLevelDoc.exists() ? bacLevelDoc.data().value : 0;

    // Calculate new total BAC level
    totalBACLevel += BACIncrease;

    // Determine drunkness level based on the total BAC level
    drunknessLevel = getDrunkennessLevel(totalBACLevel).simple;

    // // Update total BAC level in Firestore
    // await updateDoc(bacLevelRef, {
    //   value: increment(BACIncrease), // Increment the total BAC level
    //   lastUpdated: new Date()
    // });

  } catch (error) {
    console.error('Error fetching or updating BAC level:', error);
  }

  const entryDoc = {
    user_id: user.uid,
    alcohol,
    amount: parseInt(amount),
    units: parseFloat(units),
    price: parseFloat(price),
    selectedCurrency,
    type,
    calories,
    startTime: moment(selectedStartTime, 'HH:mm').toISOString(),
    endTime: moment(selectedEndTime, 'HH:mm').toISOString(),
    BACIncrease,
    drunknessLevel, // Add drunkness level to entry document
    date: selectedDate,
    timestamp: new Date(), // Current date and time
  };

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

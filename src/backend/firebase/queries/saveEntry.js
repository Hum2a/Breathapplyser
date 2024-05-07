import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import moment from 'moment';
import calculateBACIncrease from '../../../frontend/utils/calculations/calculateBAC';

const firestore = getFirestore();


export const saveEntry = async (user, userProfile, entryDetails) => {
  if (!user) {
    console.error("User data is not available");
    return;
  }

  const getDrunkennessLevel = async (totalBAC) => {
    const levelsRef = doc(getFirestore(), user.uid, 'Drunk Parameters');
    try {
      const docSnap = await getDoc(levelsRef);
      if (docSnap.exists()) {
        const levels = docSnap.data().levels;
        // Assuming levels are sorted by upper limit of BAC and are continuous ranges
        const level = levels.find(l => {
          const [lower, upper] = l.range.split(' - ').map(parseFloat);
          return totalBAC >= lower && totalBAC < upper;
        });
        return level ? level.simple : 'Unknown'; // Default to 'Unknown' if no level is matched
      }
      return 'Unknown'; // Default level if no data is available
    } catch (error) {
      console.error('Error fetching drunkness levels:', error);
      return 'Unknown'; // Default level on error
    }
  };
  

  const { alcohol, amount, units, price, type, selectedStartTime, selectedEndTime, selectedDate, selectedCurrency } = entryDetails;
  const BACIncrease = calculateBACIncrease(units, userProfile);

  const dateStr = moment(selectedDate).format('YYYY-MM-DD');
  const bacLevelRef = doc(firestore, user.uid, "Daily Totals", "BAC Level", dateStr);

  try {
    const bacLevelDoc = await getDoc(bacLevelRef);
    let totalBACLevel = bacLevelDoc.exists() ? bacLevelDoc.data().value : 0;
    totalBACLevel += BACIncrease;

    const drunknessLevel = await getDrunkennessLevel(totalBACLevel);  // Fetch drunkness level based on updated BAC level

    // Update total BAC level in Firestore
    await updateDoc(bacLevelRef, {
      value: increment(BACIncrease),
      lastUpdated: new Date()
    });

    // Prepare and save entry document
    const entryDoc = {
      user_id: user.uid,
      alcohol,
      amount: parseInt(amount),
      units: parseFloat(units),
      price: parseFloat(price),
      type,
      selectedCurrency,
      startTime: moment(selectedStartTime, 'HH:mm').toISOString(),
      endTime: moment(selectedEndTime, 'HH:mm').toISOString(),
      BACIncrease,
      drunknessLevel,
      date: selectedDate,
      timestamp: new Date(),
    };

    const entryDocId = moment().format('YYYYMMDD_HHmmss');
    const dateStrDocRef = doc(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr);
    await setDoc(dateStrDocRef, { lastUpdated: new Date() }, { merge: true });
    await setDoc(doc(dateStrDocRef, "EntryDocs", entryDocId), entryDoc);

    console.log('Entry saved successfully');
  } catch (error) {
    console.error('Error in saving entry:', error);
  }
};

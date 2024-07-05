import { doc, getDoc, setDoc } from 'firebase/firestore';
import moment from 'moment';

const calculateBACDecrease = (currentBAC, hoursElapsed) => {
  const decreaseRate = 0.015; // BAC decreases at a rate of 0.015 per hour
  return currentBAC - (hoursElapsed * decreaseRate);
};

export const saveDailyTotals = async (firestore, user, selectedDate, entryDetailsArray) => {
  if (!user) {
    console.error("User data is not available");
    return;
  }

  const selectedDateStr = moment(selectedDate).format('YYYY-MM-DD');
  const amountSpentRef = doc(firestore, user.uid, "Daily Totals", "Amount Spent", selectedDateStr);
  const unitsIntakeRef = doc(firestore, user.uid, "Daily Totals", "Unit Intake", selectedDateStr);
  const bacLevelRef = doc(firestore, user.uid, "Daily Totals", "BAC Level", selectedDateStr);

  console.log('saveDailyTotals: Called with parameters:', { user, selectedDate, entryDetailsArray });

  try {
    console.log('saveDailyTotals: Fetching existing values for date:', selectedDateStr);

    // Fetch existing values
    const amountSpentDoc = await getDoc(amountSpentRef);
    const unitsIntakeDoc = await getDoc(unitsIntakeRef);
    const bacLevelDoc = await getDoc(bacLevelRef);

    // Existing values or default to 0 if not present
    const existingAmountSpent = amountSpentDoc.exists() ? amountSpentDoc.data().value : 0;
    const existingUnitsIntake = unitsIntakeDoc.exists() ? unitsIntakeDoc.data().value : 0;
    const existingBACLevel = bacLevelDoc.exists() ? bacLevelDoc.data().value : 0;

    console.log('saveDailyTotals: Existing values:', { existingAmountSpent, existingUnitsIntake, existingBACLevel });

    // Calculate new totals
    const newAmountSpent = existingAmountSpent + entryDetailsArray.reduce((total, entry) => total + (entry.amount * entry.price), 0);
    const newUnitsIntake = existingUnitsIntake + entryDetailsArray.reduce((total, entry) => total + parseInt(entry.units), 0);
    
    // Calculate time elapsed since the last drink to now
    const lastDrinkEndTime = moment.max(entryDetailsArray.map(entry => moment(entry.selectedEndTime)));
    const now = moment();
    let hoursElapsed = now.isValid() && lastDrinkEndTime.isValid() ? now.diff(lastDrinkEndTime, 'hours', true) : 0;

    console.log('saveDailyTotals: Time elapsed since last drink:', hoursElapsed);

    // Calculate the decreased BAC based on the time elapsed
    const decreasedBAC = calculateBACDecrease(existingBACLevel, hoursElapsed);
    const newBACLevel = decreasedBAC + entryDetailsArray.reduce((total, entry) => total + parseFloat(entry.BACIncrease), 0);

    console.log('saveDailyTotals: New calculated values:', { newAmountSpent, newUnitsIntake, newBACLevel });

    // Update and save new values
    await setDoc(amountSpentRef, { value: newAmountSpent, lastUpdated: moment().format('YY-MM-DD HH:mm:ss') }, { merge: true });
    console.log('saveDailyTotals: Updated Amount Spent:', newAmountSpent);
    await setDoc(unitsIntakeRef, { value: newUnitsIntake, lastUpdated: moment().format('YY-MM-DD HH:mm:ss') }, { merge: true });
    console.log('saveDailyTotals: Updated Units Intake:', newUnitsIntake);
    await setDoc(bacLevelRef, { value: newBACLevel, lastUpdated: moment().format('YY-MM-DD HH:mm:ss') }, { merge: true });
    console.log('saveDailyTotals: Updated BAC Level:', newBACLevel);

    console.log('saveDailyTotals: Successfully updated daily totals');
  } catch (error) {
    console.error('saveDailyTotals: Error updating daily totals:', error);
    throw new Error('Could not update daily totals.');
  }
};

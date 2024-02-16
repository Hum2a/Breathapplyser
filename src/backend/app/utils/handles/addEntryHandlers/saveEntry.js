// HandleSaveEntry.js
import moment from 'moment';
import { saveEntry } from './../../../../firebase/queries/saveEntry';
import { saveBACLevel } from './../../../../firebase/queries/saveBACLevel';
import calculateBACIncrease from '../../../../../frontend/utils/calculations/calculateBAC';
import { validateAmount, validateUnits, validatePrice } from '../../validations/addEntryValidation';
import { setDoc, doc, getDoc } from 'firebase/firestore';

const handleSaveEntry = async (user, userProfile, entryDetails, selectedDate, selectedCurrency, firestore, navigation) => {
  if (!validateAmount(entryDetails.amount) || !validateUnits(entryDetails.units) || !validatePrice(entryDetails.price)) {
    alert('Please enter valid values for Amount, Units, and Price.');
    return;
  }

  if (!user) {
    console.error("User data is not available");
    return;
  }

  // Convert the selected amount to a number
  const selectedAmount = parseInt(entryDetails.amount);
  const entryDetailsArray = []; // Declare an array to store entryDetails

  // Create multiple entries based on the selected amount
  for (let i = 0; i < selectedAmount; i++) {
    // Your entry details here
    const formattedEntry = {
      ...entryDetails,
      selectedStartTime: moment(entryDetails.selectedStartTime).format('HH:mm'),
      selectedEndTime: moment(entryDetails.selectedEndTime).format('HH:mm'),
      selectedDate,
      selectedCurrency,
    };

    entryDetailsArray.push(formattedEntry); // Add entryDetails to the array

    await saveEntry(user, userProfile, formattedEntry);

    const bacUpdateDetails = {
      selectedStartTime: formattedEntry.selectedStartTime,
      selectedEndTime: formattedEntry.selectedEndTime,
      selectedDate,
    };

    await saveBACLevel(user, formattedEntry.units, userProfile, bacUpdateDetails);

    const BACIncrease = calculateBACIncrease(formattedEntry.units, userProfile);
    formattedEntry.BACIncrease = BACIncrease;
  }

  // Now you can use entryDetailsArray for further processing or outside of the loop

  // For example, you can access the first entryDetails like this:
  console.log("First entryDetails:", entryDetailsArray[0]);

  // Update total amounts for the day
  const selectedDateStr = moment(selectedDate).format('YYYY-MM-DD');
  const amountSpentRef = doc(firestore, user.uid, "Daily Totals", "Amount Spent", `${selectedDateStr}`);
  const unitsIntakeRef = doc(firestore, user.uid, "Daily Totals", "Unit Intake", `${selectedDateStr}`);
  const bacLevelRef = doc(firestore, user.uid, "Daily Totals", "BAC Level", `${selectedDateStr}`);

  // Fetch existing values
  const amountSpentDoc = await getDoc(amountSpentRef);
  const unitsIntakeDoc = await getDoc(unitsIntakeRef);
  const bacLevelDoc = await getDoc(bacLevelRef);

  // Update and save new values
  const newAmountSpent = entryDetailsArray.reduce((total, entry) => total + (entry.amount * entry.price), 0);
  const newUnitsIntake = entryDetailsArray.reduce((total, entry) => total + parseInt(entry.units), 0);
  const newBACLevel = entryDetailsArray.reduce((total, entry) => total + parseFloat(entry.BACIncrease), 0);

  await setDoc(amountSpentRef, { value: newAmountSpent });
  await setDoc(unitsIntakeRef, { value: newUnitsIntake });
  await setDoc(bacLevelRef, { value: newBACLevel });

  const selectedCurrencyAmountSpent = entryDetails.amount * entryDetails.price;
  const updatedAmountSpent = { ...amountSpent, [selectedCurrency]: selectedCurrencyAmountSpent };
  setAmountSpent(updatedAmountSpent);

  navigation.navigate('Home');
};

export default handleSaveEntry;

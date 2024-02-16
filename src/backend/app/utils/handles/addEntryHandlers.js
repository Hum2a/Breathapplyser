import moment from 'moment';
import { sendNotification } from '../../../../frontend/utils/notifications';
import calculateBACIncrease from '../../../../frontend/utils/calculations/calculateBAC';
import { saveBACLevel } from '../../../firebase/queries/saveBACLevel';
import { saveEntry } from '../../../firebase/queries/saveEntry';

export const handleStartTimeConfirm = (time, setSelectedStartTime, hideStartTimePicker, isFutureTime, runShakeAnimation, runColourFlashAnimation, selectedDate) => {
  const formattedTime = moment(time).format('HH:mm');
  const combinedDateTime = moment(`${selectedDate} ${formattedTime}`);
  if (isFutureTime(combinedDateTime)) {
    runShakeAnimation();
    runColourFlashAnimation();
    alert("Future times are not allowed.");
    return;
  }
  setSelectedStartTime(formattedTime);
  hideStartTimePicker();
};

export const handleEndTimeConfirm = (time, setSelectedEndTime, hideEndTimePicker, isFutureTime, runShakeAnimation, runColourFlashAnimation, selectedDate) => {
    const formattedTime = moment(time).format('HH:mm');
    const combinedDateTime = moment(`${selectedDate} ${formattedTime}`);
    if (isFutureTime(combinedDateTime)) {
      runShakeAnimation();
      runColourFlashAnimation();
      alert("Future times are not allowed.");
      return;
    }
    setSelectedEndTime(formattedTime);
    hideEndTimePicker();
  };

export const handleDateChange = (event, selectedDate, setDatePickerVisible, setSelectedDate) => {
    setDatePickerVisible(false); // Hide the date picker

    const currentDate = selectedDate || new Date(); // Use selected date or current date
    if (currentDate > new Date()) {
      // If the selected date is in the future, show an alert and do not update the date
      Alert.alert("Invalid Date", "Future dates are not allowed.");
      return;
    }
    setSelectedDate(currentDate); // Update the selected date
  };

export const handleCheckLimits = async (user, firestore, setTotalDrinks, setTotalUnits, setTotalSpending) => {
    console.log("handleCheckLimits called");

    // Check if user exists
    if (!user) {
      console.error("User data is not available");
      return;
    }
  
    // Fetch entries from Firestore
    const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "entries");
    const entriesQuery = query(entriesRef, where("user_id", "==", user.uid));
    const entriesSnapshot = await getDocs(entriesQuery);
    const entriesData = entriesSnapshot.docs.map(doc => doc.data());
  
    // Fetch user settings from Firestore
    const settingsRef = doc(firestore, user.uid, "Limits");
    const settingsSnapshot = await getDoc(settingsRef);
    if (!settingsSnapshot.exists()) {
      console.error("No settings document found!");
      return;
    }
    const { spendingLimit, drinkingLimit } = settingsSnapshot.data();
  
    // Calculate total drinks, units, and spending
    const totalDrinks = entriesData.reduce((total, entry) => total + parseFloat(entry.amount), 0);
    const totalUnits = entriesData.reduce((total, entry) => total + parseInt(entry.units), 0);
    const totalSpending = entriesData.reduce((total, entry) => total + (parseFloat(entry.price) * parseFloat(entry.amount)), 0);
  
    setTotalDrinks(totalDrinks);
    setTotalUnits(totalUnits);
    setTotalSpending(totalSpending);
  
    // Check against limits from Firestore
    if (totalSpending > spendingLimit) {
      sendNotification('Spending Limit Reached', 'You have exceeded your spending limit.');
    }
    if (totalDrinks > drinkingLimit) {
      sendNotification('Drinking Limit Reached', 'You have reached your drinking limit.');
    }
  };

// Add other handlers as needed

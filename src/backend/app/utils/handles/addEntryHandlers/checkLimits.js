import { sendNotification } from './../../../../../frontend/utils/notifications';

export const handleCheckLimits = async (user, firestore, setTotalDrinks, setTotalUnits, setTotalSpending) => {
    console.log("handleCheckLimits called");

    // Check if user exists
    if (!user) {
      console.error("User data is not available");
      return;
    }
  
    // Fetch entries from Firestore
    const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries");
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
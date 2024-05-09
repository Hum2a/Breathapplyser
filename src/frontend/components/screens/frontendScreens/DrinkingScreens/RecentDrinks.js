import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { getFirestore, collection, query, orderBy, limit, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext'; // Update the path according to your project structure
import moment from 'moment';
import { RecentStyles as styles } from '../../../styles/DrinkingStyles/recentStyles';
import { saveBACLevel } from '../../../../../backend/firebase/queries/saveBACLevel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from 'react-native-dialog';

const RecentDrinks = ({ navigation }) => {
  const [recentDrinks, setRecentDrinks] = useState([]);
  const [recentDrinksLimit, setRecentDrinksLimit] = useState(3);
  const [userProfile, setUserProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [limits, setLimits] = useState({
    spendingLimit: 0,
    drinkingLimit: 0,
    spendingLimitStrictness: 'soft',
    drinkingLimitStrictness: 'soft',
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [ignoreRepeatDrinks, setIgnoreRepeatDrinks] = useState(false);

  const { user } = useContext(UserContext);
  const firestore = getFirestore();

  const onRefresh = () => {
    fetchRecentDrinksControls();
    fetchRecentDrinks(true); // Always pass true to force refresh
  };

  useEffect(() => {
    fetchRecentDrinksControls();
    fetchUserProfile();
    fetchRecentDrinks();
    fetchLimits();
  }, [user]);

  const fetchRecentDrinksControls = async () => {
    userDocRef = doc(firestore, user.uid, "Recent Drinks Controls");
    try {
      const docSnap = await getDoc(userDocRef);
      const recDrinksLimit = docSnap.exists() ? docSnap.data().number : 3;
      const IgnRepeatDrinks = docSnap.exists() ? docSnap.data().ignoreRepeatDrinks : false;
      setRecentDrinksLimit(recDrinksLimit);
      setIgnoreRepeatDrinks(IgnRepeatDrinks);
      console.log(`Recent Drinks number: ${recDrinksLimit}`)
    } catch (error) {
      console.error("Error fetching recent drink controls");
      showDialog("Error", "Failed to fetch recent drinks.");
    }
  };

  const fetchRecentDrinks = async (forceRefresh = false) => {
    setRefreshing(true);
    if (!user) {
      console.error('User is not authenticated.');
      return;
    }
  
    const cacheKey = `recentDrinks_${user.uid}`;
    let fetchedRecentDrinks = [];
    let currentDate = moment();
    let drinkTypes = new Set(); // To track drink types if ignoreRepeatDrinks is true

    // Try to load the cached data first
    const cachedData = await AsyncStorage.getItem(cacheKey);
    if (cachedData && !forceRefresh) {
      const parsedCache = JSON.parse(cachedData);
      const cacheDate = moment(parsedCache.date, 'YYYY-MM-DD');
      if (cacheDate.isSame(moment(), 'day')) {
        console.log('Loading drinks from cache');
        setRecentDrinks(parsedCache.drinks);
        setRefreshing(false);
        return;
      }
    }

    try {
      while (currentDate.isAfter(moment().subtract(30, 'days')) && fetchedRecentDrinks.length < recentDrinksLimit) {
        const dateStr = currentDate.format('YYYY-MM-DD');
        const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs");
        const q = query(entriesRef, orderBy("date", "desc"), limit(50)); // Fetch up to 50 documents per day
        const querySnapshot = await getDocs(q);
  
        querySnapshot.forEach(doc => {
          if (fetchedRecentDrinks.length < recentDrinksLimit) {
            const docData = doc.data();
            // Check for repeat drinks if ignoreRepeatDrinks is enabled
            if (ignoreRepeatDrinks) {
              if (!drinkTypes.has(docData.type)) {
                drinkTypes.add(docData.type);
                fetchedRecentDrinks.push({ id: doc.id, ...docData });
              }
            } else {
              fetchedRecentDrinks.push({ id: doc.id, ...docData });
            }
          }
        });

        currentDate.subtract(1, 'day'); // Decrement the day
      }

      // Update the cache with new data
      await AsyncStorage.setItem(cacheKey, JSON.stringify({ date: moment().format('YYYY-MM-DD'), drinks: fetchedRecentDrinks }));
      setRecentDrinks(fetchedRecentDrinks);
    } catch (error) {
      console.error('Error fetching recent drinks:', error);
      showDialog('Error', 'Could not fetch recent drinks.');
    }
    setRefreshing(false);
};

  
  const fetchUserProfile = async () => {
    if (!user) return;
  
    const docRef = doc(firestore, user.uid, "Profile");
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
        fetchLimits(); // Ensure limits are fetched after fetching user profile
      } else {
        console.log("No such profile document!");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  
  const fetchLimits = async () => {
    if (!user) {
      console.error("User data is not available");
      return;
    }
  
    const limitsDocRef = doc(firestore, user.uid, "Limits");
    try {
      const docSnap = await getDoc(limitsDocRef);
      if (docSnap.exists()) {
        const limitsData = docSnap.data();
        setLimits({
          spendingLimit: limitsData.spendingLimit || 0,
          drinkingLimit: limitsData.drinkingLimit || 0,
          spendingLimitStrictness: limitsData.spendingLimitStrictness || 'soft',
          drinkingLimitStrictness: limitsData.drinkingLimitStrictness || 'soft',
        });
      } else {
        console.log("No limits document found");
      }
    } catch (error) {
      console.error("Error fetching limits:", error);
    }
  };
  

  const handleReenterDrink = async (drink) => {
    const currentTotals = await getCurrentTotals();
    const newTotalUnits = currentTotals.totalUnits + drink.units;
    const newTotalSpending = currentTotals.totalSpending + drink.price;

    // Check against limits
    if (limits.spendingLimitStrictness === "hard" && newTotalSpending > limits.spendingLimit) {
      showDialog('Limit Reached', 'You have reached your hard spending limit.');
      return;
    } else if (limits.drinkingLimitStrictness === "hard" && newTotalUnits > limits.drinkingLimit) {
      showDialog('Limit Reached', 'You have reached your hard drinking limit.');
      return;
    }

    if (limits.spendingLimitStrictness === "soft" && newTotalSpending > limits.spendingLimit) {
      showDialog('Warning', 'You are approaching your soft spending limit.');
    }
    if (limits.drinkingLimitStrictness === "soft" && newTotalUnits > limits.drinkingLimit) {
      showDialog('Warning', 'You are approaching your soft drinking limit.');
    }
    try {
      const { id, ...drinkDetails } = drink; // Destructure to exclude the 'id'
      // Spread the original drink details except for date and times, which are set to the current time
      const newEntry = {
        ...drinkDetails,
        date: new Date(), // Current date and time
        startTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        timestamp: new Date(),
      };

      const newEntryDetails = {
        selectedStartTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        selectedEndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        selectedDate: moment().toDate(),
      };
  
      // Generate a new document ID for the entry
      const dateTimeString = moment().format('YYYYMMDD_HHmmss');
      const dateStr = moment().format('YYYY-MM-DD');
      const entryDocId = `${dateTimeString}`;
  
      // Add the new entry to the Firestore collection
      await setDoc(doc(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs", entryDocId), newEntry);

      // Update the BAC Level using the saveBACLevel function
      await saveBACLevel(user, drink.units, userProfile, newEntryDetails);
  
      // Define references for daily totals
      const selectedDateStr = moment().format('YYYY-MM-DD');
      const amountSpentRef = doc(firestore, user.uid, "Daily Totals", "Amount Spent", selectedDateStr);
      const unitsIntakeRef = doc(firestore, user.uid, "Daily Totals", "Unit Intake", selectedDateStr);
      const bacLevelRef = doc(firestore, user.uid, "Daily Totals", "BAC Level", selectedDateStr);

      // Fetch existing daily totals
      const amountSpentDoc = await getDoc(amountSpentRef);
      const unitsIntakeDoc = await getDoc(unitsIntakeRef);
      const bacLevelDoc = await getDoc(bacLevelRef);

      // Calculate new totals
      const newAmountSpent = (amountSpentDoc.exists() ? amountSpentDoc.data().value : 0) + drink.price;
      const newUnitsIntake = (unitsIntakeDoc.exists() ? unitsIntakeDoc.data().value : 0) + drink.units;
      const newBACLevel = (bacLevelDoc.exists() ? bacLevelDoc.data().value : 0) + drink.BACIncrease;

        // Update and save new values
      await setDoc(amountSpentRef, { value: newAmountSpent, lastUpdated: moment().format('YY-MM-DD HH:mm:ss') }, { merge: true });
      await setDoc(unitsIntakeRef, { value: newUnitsIntake, lastUpdated: moment().format('YY-MM-DD HH:mm:ss') }, { merge: true });
      await setDoc(bacLevelRef, { value: newBACLevel, lastUpdated: moment().format('YY-MM-DD HH:mm:ss') }, { merge: true });
  
  
      showDialog('Success', 'Drink re-entered successfully and DailyTotals updated.');
  
      // Optionally, refresh the UI or navigate as needed
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error re-entering drink and updating DailyTotals:', error);
      showDialog('Error', 'Could not re-enter the drink and update DailyTotals.');
    }
  };

  const getCurrentTotals = async () => {
    if (!user) {
      console.error("User data is not available");
      return { totalUnits: 0, totalSpending: 0 };
    }
  
    const selectedDateStr = moment().format('YYYY-MM-DD');
    let totalUnits = 0;
    let totalSpending = 0;
  
    // Define references and attempt to fetch existing daily totals
    const amountSpentRef = doc(firestore, user.uid, "Daily Totals", "Amount Spent", selectedDateStr);
    const unitsIntakeRef = doc(firestore, user.uid, "Daily Totals", "Unit Intake", selectedDateStr);
  
    try {
      const amountSpentDoc = await getDoc(amountSpentRef);
      const unitsIntakeDoc = await getDoc(unitsIntakeRef);
  
      totalUnits = unitsIntakeDoc.exists() ? unitsIntakeDoc.data().value : 0;
      totalSpending = amountSpentDoc.exists() ? amountSpentDoc.data().value : 0;
  
    } catch (error) {
      console.error("Error fetching daily totals:", error);
    }
  
    return { totalUnits, totalSpending };
  };
  
  const showDialog = (title, message) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };
  

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handleReenterDrink(item)}
    >
      <Text style={styles.text}>Alcohol: {item.alcohol}</Text>
      <Text style={styles.text}>Units: {item.units}</Text>
      <Text style={styles.text}>Type: {item.type}</Text>
      <Text style={styles.text}>Price: {item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.title} // Define this style to align with your design
        onPress={() => fetchRecentDrinks(true)}  // Pass true to force a refresh
      >
      <Text style={styles.title}>Recent Drinks</Text>
      </TouchableOpacity>
      <FlatList
        data={recentDrinks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />

      <Dialog.Container
        visible={dialogVisible}
        contentStyle={styles.dialogContainer}
        style={styles.dialogContainer} // If needed to apply additional styling on the dialog wrapper
      >
        <Dialog.Title style={styles.dialogTitle}>{dialogTitle}</Dialog.Title>
        <Dialog.Description style={styles.dialogDescription}>
          {dialogMessage}
        </Dialog.Description>
        <Dialog.Button
          label="OK"
          onPress={() => setDialogVisible(false)}
          style={styles.dialogButton}
          textStyle={styles.dialogButtonText}
        />
      </Dialog.Container>

    </View>
  );
};

export default RecentDrinks;

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { getFirestore, collection, query, orderBy, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import moment from 'moment';
import { UserContext } from '../../../../context/UserContext'; // Update path as needed
import { CommonStyles as styles } from '../../../styles/DrinkingStyles/commonStyles';
import { saveBACLevel } from '../../../../../backend/firebase/queries/saveBACLevel';
import AsyncStorage from '@react-native-async-storage/async-storage'

const CommonDrinks = () => {
  const [commonDrinks, setCommonDrinks] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [limits, setLimits] = useState({
    spendingLimit: 0,
    drinkingLimit: 0,
    spendingLimitStrictness: 'soft',
    drinkingLimitStrictness: 'soft',
  });
  
  const { user } = useContext(UserContext);
  const firestore = getFirestore();

  useEffect(() => {
    fetchUserProfile()
    if (user) {
      fetchCommonDrinks();
      fetchLimits();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    console.log("fetchUserProfile called");
    if (user) {
      console.log('User found');
      const docRef = doc(firestore, user.uid, "Profile");
      console.log('docRef initialised');
  
      try {
        const promise = getDoc(docRef);
        const timeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out')), 5000) // 5 seconds timeout
        );
        const docSnap = await Promise.race([promise, timeout]);
        console.log('docSnap initialised');
  
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
          console.log('userProfile retrieved');
          // Use userProfile for BAC calculations and other operations
        } else {
          console.log("No such profile document!");
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    }
  };    

  const fetchCommonDrinks = async (forceRefresh = false) => {
    setRefreshing(true);
    if (!user) return;
  
    const cachedData = await AsyncStorage.getItem(`commonDrinksCache_${user.uid}`);
    if (cachedData && !forceRefresh) {
      const { data, timestamp } = JSON.parse(cachedData);
      const currentTime = new Date().getTime();
      const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      console.log(`Cache timestamp: ${timestamp}`);
      console.log(`Current timestamp: ${currentTime}`);
      console.log(`Time since cache was saved: ${(currentTime - timestamp) / 1000} seconds`);
  
      if (currentTime - timestamp < cacheDuration) {
        setCommonDrinks(data);
        console.log('Loaded common drinks from cache');
        return; // Exit if cached data was found and is fresh
      } else {
        console.log('Cache is outdated, fetching new data');
      }
    } else {
      console.log('No cached data found, fetching new data');
    }
  
    // If no cache or cache is outdated, proceed to fetch from Firestore
    const firestore = getFirestore();
    const drinkOccurrences = {};
    let totalQueries = 1; // Start with one for the initial date fetch
    let totalReads = 0;
  
    const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries");
    const allDatesSnapshot = await getDocs(entriesRef);
    totalReads += allDatesSnapshot.size; // Add the reads from this initial fetch
    console.log(`Initial fetch for all entry dates, Read Count: ${allDatesSnapshot.size}`);
  
    const endDate = moment();
    const startDate = moment().subtract(49, 'days'); // last 50 days including today
    const validDates = [];
  
    allDatesSnapshot.forEach(doc => {
      const dateStr = doc.id; // Assuming document IDs are dates in 'YYYY-MM-DD' format
      const dateMoment = moment(dateStr, 'YYYY-MM-DD');
      if (dateMoment.isBetween(startDate, endDate, 'days', '[]')) {
        validDates.push(dateStr);
      }
    });
  
    for (const dateStr of validDates) {
      const dailyEntriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs");
      const querySnapshot = await getDocs(query(dailyEntriesRef, orderBy("date", "desc")));
      totalQueries++;
      totalReads += querySnapshot.size;
      console.log(`Fetch for date ${dateStr}, Read Count: ${querySnapshot.size}`);
  
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const key = `${data.alcohol}-${data.type}`;
        if (!drinkOccurrences[key]) {
          drinkOccurrences[key] = { count: 1, ...data };
        } else {
          drinkOccurrences[key].count += 1;
        }
      });
    }
  
    const sortedCommonDrinks = Object.values(drinkOccurrences)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Take top 3 most common drinks
  
    setCommonDrinks(sortedCommonDrinks);
    await AsyncStorage.setItem(`commonDrinksCache_${user.uid}`, JSON.stringify({
      data: sortedCommonDrinks,
      timestamp: new Date().getTime()
    }));
  
    console.log(`Total Firestore Queries: ${totalQueries}`);
    console.log(`Total Firestore Reads: ${totalReads}`);
    console.log(`Total Unique Drink Entries: ${Object.keys(drinkOccurrences).length}`);
    setRefreshing(false);
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
    const canProceed = await checkLimits(drink);
    if (!canProceed) return; 
    const { id, ...drinkDetails } = drink;

    const newEntry = {
      ...drinkDetails,
      date: new Date(),
      startTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      timestamp: new Date(),
    };

    const entryDetails = {
      selectedStartTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      selectedEndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      selectedDate: moment().toDate(),
    };

    const dateTimeString = moment().format('YYYYMMDD_HHmmss');
    const dateStr = moment().format('YYYY-MM-DD');
    const entryDocId = `Entry_${dateTimeString}`;

    try {
      await setDoc(doc(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs", entryDocId), newEntry);

      // Assuming you have userProfile in context to calculate BACIncrease
      await saveBACLevel(user, drink.units, userProfile, entryDetails);

      // Update daily totals similarly to how it's done in RecentDrinks
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
   

      Alert.alert('Success', 'Drink re-entered successfully.');
    } catch (error) {
      console.error('Error re-entering drink:', error);
      Alert.alert('Error', 'Could not re-enter the drink.');
    }
  };

  const checkLimits = async (drink) => {
    const currentTotals = await getCurrentTotals();
    const newTotalUnits = currentTotals.totalUnits + drink.units;
    const newTotalSpending = currentTotals.totalSpending + drink.price;
  
    // Spending limit checks
    if (limits.spendingLimitStrictness === "hard" && newTotalSpending > limits.spendingLimit) {
      Alert.alert('Limit Reached', 'You have reached your hard spending limit.');
      return false;
    } else if (limits.spendingLimitStrictness === "soft" && newTotalSpending > limits.spendingLimit) {
      Alert.alert('Warning', 'Approaching soft spending limit.');
    }
  
    // Drinking limit checks
    if (limits.drinkingLimitStrictness === "hard" && newTotalUnits > limits.drinkingLimit) {
      Alert.alert('Limit Reached', 'You have reached your hard drinking limit.');
      return false;
    } else if (limits.drinkingLimitStrictness === "soft" && newTotalUnits > limits.drinkingLimit) {
      Alert.alert('Warning', 'Approaching soft drinking limit.');
    }
  
    return true;
  };

  const getCurrentTotals = async () => {
    if (!user) {
      console.error("User data is not available");
      return { totalUnits: 0, totalSpending: 0 };
    }
  
    const selectedDateStr = moment().format('YYYY-MM-DD');
    let totalUnits = 0;
    let totalSpending = 0;
  
    // Reference to the user's entries for the current day
    const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", selectedDateStr, "EntryDocs");
  
    // Attempt to fetch the day's entries
    try {
      const querySnapshot = await getDocs(entriesRef);
  
      querySnapshot.forEach(doc => {
        const data = doc.data();
        totalUnits += data.units || 0; // Assuming 'units' field holds the number of units per drink
        totalSpending += data.price || 0; // Assuming 'price' field holds the price per drink
      });
  
    } catch (error) {
      console.error("Error fetching daily totals:", error);
    }
  
    // Optionally, consider including additional checks for spending limits if they are stored/managed differently
  
    return { totalUnits, totalSpending };
  };
  
  const onRefresh = () => {
    fetchCommonDrinks(true); // Always pass true to force refresh
  };
  

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handleReenterDrink(item)}
    >
      <Text style={styles.text}>{`${item.alcohol} - ${item.type}: ${item.count}`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.title} // Define this style to align with your design
        onPress={() => fetchCommonDrinks(true)}  // Pass true to force a refresh
      >
        <Text style={styles.title}>Top 3 Common Drinks</Text>
      </TouchableOpacity>
      <FlatList
        data={commonDrinks}
        renderItem={renderItem}
        keyExtractor={item => `${item.alcohol}-${item.type}`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};

export default CommonDrinks;

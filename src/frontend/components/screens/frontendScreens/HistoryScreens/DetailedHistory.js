import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Image, RefreshControl } from 'react-native';
import { DetailedHistoryStyles as styles } from '../../../styles/HistoryStyles/detailedHistoryStyles';
import { collection, query, where, getDocs, getFirestore, Timestamp, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
import moment from 'moment';
import { UserContext } from '../../../../context/UserContext';
import Dialog from 'react-native-dialog';
import { dialogStyles } from '../../../styles/AppStyles/dialogueStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackButton } from '../../../buttons/backButton';

const DetailedHistoryScreen = ({ route, navigation }) => {
  const { date } = route.params;
  const [entries, setEntries] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null); // Track the selected entry for deletion
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [summary, setSummary] = useState({
    totalDrinks: 0,
    amountSpent: 0,
    unitsIntook: 0,
    drinkTypes: {}
  });
  
  const firestore = getFirestore();
  const { user } = useContext(UserContext);

  const fetchEntries = async (forceUpdate = false) => {
    setRefreshing(true);
    const firestorePath = `${user.uid}/Alcohol Stuff/Entries/${date}/EntryDocs`;
    const cacheKey = `entries-${user.uid}-${date}`;
    
    if (!forceUpdate) {
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        const parsedCache = JSON.parse(cachedData);
        const { timestamp, entries } = parsedCache;

        if (new Date().getTime() - timestamp < 86400000) {
          console.log('Using cached data');
          setEntries(entries);
          return;
        }
      }
    }

    console.log('Cached data is outdated or force update triggered, fetching new data');
    await AsyncStorage.removeItem(cacheKey);

    const startOfDay = moment(date, 'YYYY-MM-DD').startOf('day').toDate();
    const endOfDay = moment(date, 'YYYY-MM-DD').endOf('day').toDate();
    const firestoreStart = Timestamp.fromDate(startOfDay);
    const firestoreEnd = Timestamp.fromDate(endOfDay);

    const q = query(
      collection(firestore, firestorePath),
      where("date", ">=", firestoreStart),
      where("date", "<=", firestoreEnd)
    );

    const querySnapshot = await getDocs(q);
    const entriesData = querySnapshot.docs.map(doc => {
      const entry = doc.data();
      entry.id = doc.id;
      entry.date = moment(entry.date.toDate()).format('YYYY-MM-DD HH:mm:ss');
      return entry;
    });

    setEntries(entriesData);
    const cacheValue = JSON.stringify({ timestamp: new Date().getTime(), entries: entriesData });
    await AsyncStorage.setItem(cacheKey, cacheValue);
    setRefreshing(false);
  };

  useEffect(() => {
    console.log('DetailedHistoryScreen: Received date parameter:', date);
    // const fetchEntries = async () => {
    //   const firestorePath = `${user.uid}/Alcohol Stuff/Entries/${date}/EntryDocs`;
    //   const cacheKey = `entries-${user.uid}-${date}`;
    
    //   try {
    //     // Attempt to get cached data
    //     const cachedData = await AsyncStorage.getItem(cacheKey);
    //     if (cachedData) {
    //       const parsedCache = JSON.parse(cachedData);
    //       const { timestamp, entries } = parsedCache;
    
    //       // Check if the cache is still fresh
    //       if (new Date().getTime() - timestamp < 86400000) { // 86400000 milliseconds = 1 day
    //         console.log('Using cached data');
    //         setEntries(entries);
    //         return;
    //       } else {
    //         // If the cache is outdated, clear it
    //         console.log('Cached data is outdated, fetching new data');
    //         await AsyncStorage.removeItem(cacheKey);
    //       }
    //     }
    
    //     // Fetch data from Firestore
    //     console.log('Fetching data from Firestore');
    //     const startOfDay = moment(date, 'YYYY-MM-DD').startOf('day').toDate();
    //     const endOfDay = moment(date, 'YYYY-MM-DD').endOf('day').toDate();
    //     const firestoreStart = Timestamp.fromDate(startOfDay);
    //     const firestoreEnd = Timestamp.fromDate(endOfDay);
    
    //     const q = query(
    //       collection(firestore, firestorePath),
    //       where("date", ">=", firestoreStart),
    //       where("date", "<=", firestoreEnd)
    //     );
    
    //     const querySnapshot = await getDocs(q);
    //     const entriesData = querySnapshot.docs.map(doc => {
    //       const entry = doc.data();
    //       entry.id = doc.id;
    //       entry.date = moment(entry.date.toDate()).format('YYYY-MM-DD HH:mm:ss');
    //       return entry;
    //     });
    
    //     // Set entries to state and update the cache
    //     setEntries(entriesData);
    //     const cacheValue = JSON.stringify({ timestamp: new Date().getTime(), entries: entriesData });
    //     await AsyncStorage.setItem(cacheKey, cacheValue);
    //   } catch (error) {
    //     console.error('Error fetching entries:', error);
    //   }
    // };
    
    fetchEntries();
  }, [date, firestore, user]);

  useEffect(() => {
    const newSummary = entries.reduce((acc, entry) => {
      acc.totalDrinks += 1;
      acc.amountSpent += entry.price;
      acc.unitsIntook += entry.units;
      acc.drinkTypes[entry.type] = (acc.drinkTypes[entry.type] || 0) + 1;
      return acc;
    }, { totalDrinks: 0, amountSpent: 0, unitsIntook: 0, drinkTypes: {} });
  
    setSummary(newSummary);
  }, [entries]);

  const chartData = entries.map(entry => ({
    date: entry.date,
    units: entry.units,
  }));
  console.log('ChartData:', chartData); // Logging Chart Data

  const handleEditEntry = (entry) => {
    console.log('Editing Entry:', entry); // Logging the entry to be edited
    navigation.navigate('EditEntries', { entry }); // Navigate to EditEntryScreen with the entry data
  };
  
  const handleDeleteEntry = async (entry) => {
    console.log('DetailedHistoryScreen: Delete Entry:', entry);
    // Assuming 'date' is in the format 'YYYY-MM-DD'
    const entryDateFormatted = moment(entry.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
    const firestorePathEntries = `${user.uid}/Alcohol Stuff/Entries/${entryDateFormatted}/EntryDocs`;
  
    try {
      // Delete the entry
      await deleteDoc(doc(firestore, firestorePathEntries, entry.id));
  
      // Adjust the daily totals
      const dailyTotalsPath = `${user.uid}/Daily Totals`;
      const amountSpentDocRef = doc(firestore, dailyTotalsPath, "Amount Spent", entryDateFormatted);
      const unitsIntakeDocRef = doc(firestore, dailyTotalsPath, "Unit Intake", entryDateFormatted);
      const bacLevelDocRef = doc(firestore, dailyTotalsPath, "BAC Level", entryDateFormatted);
  
      // Fetch current totals
      const [amountSpentDoc, unitsIntakeDoc, bacLevelDoc] = await Promise.all([
        getDoc(amountSpentDocRef),
        getDoc(unitsIntakeDocRef),
        getDoc(bacLevelDocRef),
      ]);
  
      // Subtract the values from the deleted entry
      const updatedAmountSpent = amountSpentDoc.exists() ? amountSpentDoc.data().value - entry.price * entry.amount : 0;
      const updatedUnitsIntake = unitsIntakeDoc.exists() ? unitsIntakeDoc.data().value - entry.units * entry.amount : 0;
      const updatedBACLevel = bacLevelDoc.exists() ? bacLevelDoc.data().value - entry.BACIncrease : 0;
  
      // Update the daily totals
      await Promise.all([
        setDoc(amountSpentDocRef, { value: updatedAmountSpent }, { merge: true }),
        setDoc(unitsIntakeDocRef, { value: updatedUnitsIntake }, { merge: true }),
        setDoc(bacLevelDocRef, { value: updatedBACLevel }, { merge: true }),
      ]);
  
      // Update the UI
      setEntries(previousEntries => previousEntries.filter(e => e.id !== entry.id));
      Alert.alert("Entry Deleted", "The entry and its impact on daily totals have been successfully removed.");
    } catch (error) {
      console.error("Error deleting entry or updating totals: ", error);
      Alert.alert("Error", "Could not delete the entry or update the daily totals.");
    }
  };

  const handleLongPressEntry = (entry) => {
    setSelectedEntry(entry); // Set the selected entry for deletion
    setDeleteDialogVisible(true); // Show the delete dialog
  };

  const handleDeleteConfirmed = async () => {
    setDeleteDialogVisible(false); // Hide the delete dialog
    if (selectedEntry) {
      handleDeleteEntry(selectedEntry); // Call the delete function with the selected entry
    }
  };

  const handleDeleteCancelled = () => {
    setDeleteDialogVisible(false); // Hide the delete dialog
    setSelectedEntry(null); // Clear the selected entry
  };

  const handleNavigateToVisualData = () =>{
    console.log('date passed: ', moment(date).format('YYYY-MM-DD'));
    navigation.navigate('VisualDetailedHistory', { date })
  }

  const handleNavigateToNightOut = () => {
    console.log('date passed: ', moment(date).format('YYYY-MM-DD'));
    navigation.navigate('CurrentNight', { date: moment(date).format('YYYY-MM-DD') })
  } 

  const onRefresh = () => {
    fetchEntries(true); // Always pass true to force refresh
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNavigateToVisualData}>
          <Image
            source={require('../../../../assets/images/pie.png')}
            style={styles.buttonImage} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => fetchEntries(true)}>
          <Image
            source={require('../../../../assets/images/refresh-icon.png')}
            style={styles.buttonImage} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleNavigateToNightOut}>
          <Image
            source={require('../../../../assets/images/discoball.png')}
            style={styles.buttonImage} 
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{date}</Text>
      <FlatList
        data={entries}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.entryItem}
            onLongPress={() => handleLongPressEntry(item)}
          >
            <View style={styles.entryRow}>
              <Text style={[styles.entryText, styles.entryLabel]}>Date:</Text>
              <Text style={[styles.entryText, styles.entryValue]}> {moment(item.date).format('YYYY-MM-DD')}</Text>
            </View>
            <View style={styles.entryRow}>
              <Text style={[styles.entryText, styles.entryLabel]}>Start Time:</Text>
              <Text style={[styles.entryText, styles.entryValue]}> {moment(item.startTime).format('HH:mm')}</Text>
            </View>
            <View style={styles.entryRow}>
              <Text style={[styles.entryText, styles.entryLabel]}>End Time:</Text>
              <Text style={[styles.entryText, styles.entryValue]}> {moment(item.endTime).format('HH:mm')}</Text>
            </View>
            <View style={styles.entryRow}>
              <Text style={[styles.entryText, styles.entryLabel]}>Amount:</Text>
              <Text style={[styles.entryText, styles.entryValue]}> {item.amount}</Text>
            </View>
            <View style={styles.entryRow}>
              <Text style={[styles.entryText, styles.entryLabel]}>Alcohol:</Text>
              <Text style={[styles.entryText, styles.entryValue]}> {item.alcohol}</Text>
            </View>
            <View style={styles.entryRow}>
              <Text style={[styles.entryText, styles.entryLabel]}>Units:</Text>
              <Text style={[styles.entryText, styles.entryValue]}> {item.units}</Text>
            </View>
            <View style={styles.entryRow}>
              <Text style={[styles.entryText, styles.entryLabel]}>Price:</Text>
              <Text style={[styles.entryText, styles.entryValue]}> {item.price}</Text>
            </View>
            <View style={styles.entryRow}>
              <Text style={[styles.entryText, styles.entryLabel]}>Type:</Text>
              <Text style={[styles.entryText, styles.entryValue]}> {item.type}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
          />
      }
      />

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Day Summary</Text>
        <Text style={styles.summaryText}>Total Drinks: {summary.totalDrinks}</Text>
        <Text style={styles.summaryText}>Amount Spent: £{summary.amountSpent.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Units Intook: {summary.unitsIntook.toFixed(2)}</Text>
        {Object.entries(summary.drinkTypes).map(([type, count]) => (
          <Text key={type} style={styles.summaryText}>{type}: {count}</Text>
        ))}
      </View>
      {/* Delete dialog */}
      <Dialog.Container 
        visible={deleteDialogVisible}
        contentStyle={{
          backgroundColor: 'black', // Light Blue background; solid color as gradient is not directly supported
          borderRadius: 10,
        }}>
        <Dialog.Title style={dialogStyles.title}>You called?</Dialog.Title>
        <Dialog.Description style={dialogStyles.description}>
          What would you like to do?:
        </Dialog.Description>
        <Dialog.Button style={dialogStyles.editButton}label="Edit" onPress={() => handleEditEntry(selectedEntry)}  />
        <Dialog.Button style={dialogStyles.deleteButton}label="Delete" onPress={handleDeleteConfirmed} />
        <Dialog.Button style={dialogStyles.cancelButton}label="Cancel" onPress={handleDeleteCancelled} />
      </Dialog.Container>

    </View>
  );
};

export default DetailedHistoryScreen;

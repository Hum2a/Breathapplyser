import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { DetailedHistoryStyles as styles } from '../../../styles/HistoryStyles/detailedHistoryStyles';
import { collection, query, where, getDocs, getFirestore, Timestamp, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
import moment from 'moment';
import AllCharts from '../../../charts/linecharts/IndividualCharts';
import { UserContext } from '../../../../context/UserContext';
import Dialog from 'react-native-dialog';
import { dialogStyles } from '../../../styles/AppStyles/dialogueStyles';

const DetailedHistoryScreen = ({ route, navigation }) => {
  const { date } = route.params;
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null); // Track the selected entry for deletion
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const firestore = getFirestore();
  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log('DetailedHistoryScreen: Received date parameter:', date);
    const fetchEntries = async () => {
      try {
        const firestorePath = `${user.uid}/Alcohol Stuff/Entries/${date}/EntryDocs`;
        console.log('Firestore Path:', firestorePath); // Logging Firestore Path

        const startOfDay = moment(date, 'YYYY-MM-DD').startOf('day').toDate();
        const endOfDay = moment(date, 'YYYY-MM-DD').endOf('day').toDate();
        const firestoreStart = Timestamp.fromDate(startOfDay);
        const firestoreEnd = Timestamp.fromDate(endOfDay);
        console.log('Querying Firestore between:', firestoreStart, 'and', firestoreEnd); // Logging the date range for the query

        const q = query(
          collection(firestore, firestorePath),
          where("date", ">=", firestoreStart),
          where("date", "<=", firestoreEnd)
        );

        const querySnapshot = await getDocs(q);
        const entriesData = querySnapshot.docs.map(doc => {
          const entry = doc.data();
          entry.id = doc.id; // Store the document ID
          entry.date = moment(entry.date.toDate()).format('YYYY-MM-DD HH:mm:ss');
          return entry;
        });
        

        console.log('Fetched entries:', entriesData); // Logging fetched entries
        setEntries(entriesData);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };
    fetchEntries();
  }, [date, firestore, user]);

  const chartData = entries.map(entry => ({
    date: entry.date,
    units: entry.units,
  }));
  console.log('ChartData:', chartData); // Logging Chart Data

  // const handleLongPressEntry = (entry) => {
  //   console.log('DetailedHistoryScreen: Long Pressed Entry:', entry); // Logging which entry was long-pressed
  //   Alert.alert(
  //     'Entry Options',
  //     'Choose an action for this entry:',
  //     [
  //       {
  //         text: 'Edit',
  //         onPress: () => handleEditEntry(entry),
  //       },
  //       {
  //         text: 'Delete',
  //         onPress: () => handleDeleteEntry(entry),
  //         style: 'destructive',
  //       },
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //     ],
  //   );
  // };

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detailed History - {date}</Text>
      <FlatList
        data={entries}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.entryItem}
            onLongPress={() => handleLongPressEntry(item)}
          >
            <View style={styles.entryRow}>
              <Text style={[styles.entryText, styles.entryLabel]}>Date:</Text>
              <Text style={[styles.entryText, styles.entryValue]}> {item.date}</Text>
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
      />
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
        <Dialog.Button style={dialogStyles.editButton}label="Edit" onPress={handleEditEntry} />
        <Dialog.Button style={dialogStyles.deleteButton}label="Delete" onPress={handleDeleteConfirmed} />
        <Dialog.Button style={dialogStyles.cancelButton}label="Cancel" onPress={handleDeleteCancelled} />
      </Dialog.Container>

    </View>
  );
};

export default DetailedHistoryScreen;

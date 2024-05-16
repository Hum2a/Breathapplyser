import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, RefreshControl } from 'react-native';
import { HistoryStyles as styles } from '../../../styles/HistoryStyles/historyStyles';
import { UserContext } from '../../../../context/UserContext';
import { collection, getDocs, getFirestore, writeBatch, deleteDoc, doc, getDoc } from 'firebase/firestore';
import moment from 'moment';
import { appStyles } from '../../../styles/AppStyles/appStyles';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackButton } from '../../../buttons/backButton';
import Dialog from 'react-native-dialog';
import { dialogStyles } from '../../../styles/AppStyles/dialogueStyles';

const HistoryScreen = ({ navigation }) => {
  const [dates, setDates] = useState([]); // Dates with entries
  const [dateEntries, setDateEntries] = useState([]); // Entries for the selected date
  const [dateEntryCounts, setDateEntryCounts] = useState({}); // Count of entries for each date
  const [selectedDate, setSelectedDate] = useState(null); // Selected date
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const { user } = useContext(UserContext);
  const firestore = getFirestore();

  // Fetch dates when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);


  const fetchData = async (forceRefresh = false) => {
    setRefreshing(true);
    const cacheKey = `history_dates_with_details_${user.uid}`;
    try {
      // Check the cache unless forceRefresh is true
      if (!forceRefresh) {
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          const cacheTime = moment(parsedData.timestamp);
          // Check if the cache is still valid, for example, valid for 1 day
          if (moment().diff(cacheTime, 'days') < 1) {
            console.log('Using cached data');
            setDates(parsedData.data);
            return;
          }
        }
      }
  
      if (!user) return;
  
      const querySnapshot = await getDocs(collection(firestore, user.uid, "Alcohol Stuff", "Entries"));
      const datesWithDetailsPromises = querySnapshot.docs.map(async (doc) => {
        const dateStr = doc.id;
        const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs");
        const entriesSnapshot = await getDocs(entriesRef);
  
        let totalSpent = 0;
        let totalUnits = 0;
        entriesSnapshot.forEach((doc) => {
          const entry = doc.data();
          totalSpent += parseFloat(entry.price || 0);
          totalUnits += parseFloat(entry.units || 0);
        });
  
        return {
          id: doc.id,
          name: doc.id,
          count: entriesSnapshot.size,
          totalSpent: totalSpent.toFixed(2),
          totalUnits: totalUnits.toFixed(2)
        };
      });
  
      let datesWithDetails = await Promise.all(datesWithDetailsPromises);
      datesWithDetails.sort((a, b) => moment(b.name, 'YYYY-MM-DD').diff(moment(a.name, 'YYYY-MM-DD')));
  
      setDates(datesWithDetails); // Set the sorted dates along with their entry details
      // Update the cache with new data
      await AsyncStorage.setItem(cacheKey, JSON.stringify({ timestamp: moment().toISOString(), data: datesWithDetails }));
    } catch (error) {
      console.error('Error fetching dates and their details:', error);
    }
    setRefreshing(false);
  };
  
  
  const fetchEntriesForDate = async (date) => {
    try {
      const dateStr = moment(date).format('YYYY-MM-DD');
      const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs");
      const querySnapshot = await getDocs(entriesRef);
      const entries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDateEntries(entries);
      setDateEntryCounts(prevCounts => ({ ...prevCounts, [date]: entries.length })); // Update the count for the fetched date
    } catch (error) {
      console.error('Error fetching entries for date:', error);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date); // Set the selected date state
    fetchEntriesForDate(date); // Fetch entries for the selected date
    navigation.navigate('DetailedHistory', { date }); // Navigate and pass the date
  };
  const handleCalenderClick = () => {
  navigation.navigate('HistoryCalender')
  };

  const handleLongPress = (item) => {
    setSelectedItem(item);
    setDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    const dateStr = selectedItem.name;
    const entriesCollectionRef = collection(firestore, `${user.uid}/Alcohol Stuff/Entries/${dateStr}/EntryDocs`);
    const amountSpentRef = doc(firestore, user.uid, "Daily Totals", "Amount Spent", dateStr);
    const unitsIntakeRef = doc(firestore, user.uid, "Daily Totals", "Unit Intake", dateStr);
    const bacLevelRef = doc(firestore, user.uid, "Daily Totals", "BAC Level", dateStr);

    try {
        const batch = writeBatch(firestore);
        let totalSpent = 0;
        let totalUnits = 0;
        let totalBAC = 0;

        // Calculate the totals that need to be subtracted
        const entriesSnapshot = await getDocs(entriesCollectionRef);
        entriesSnapshot.docs.forEach((doc) => {
            const entry = doc.data();
            totalSpent += parseFloat(entry.price || 0);
            totalUnits += parseFloat(entry.units || 0);
            totalBAC += parseFloat(entry.BACIncrease || 0)
            console.log(`Spent: ${totalSpent}, Units: ${totalUnits}, BAC: ${totalBAC}`)
            batch.delete(doc.ref);
        });

        // Subtract the totals from daily totals
        const amountSpentDoc = await getDoc(amountSpentRef);
        const unitsIntakeDoc = await getDoc(unitsIntakeRef);
        const BAClevelDoc = await getDoc(bacLevelRef);

        const newAmountSpent = (amountSpentDoc.exists() ? amountSpentDoc.data().value : 0) - totalSpent;
        const newUnitsIntake = (unitsIntakeDoc.exists() ? unitsIntakeDoc.data().value : 0) - totalUnits;
        const newBACLevel = (BAClevelDoc.exists() ? unitsIntakeDoc.data().value : 0) - totalBAC;

        // Update the daily totals
        if (amountSpentDoc.exists()) {
            batch.update(amountSpentRef, { value: newAmountSpent });
        }
        if (unitsIntakeDoc.exists()) {
            batch.update(unitsIntakeRef, { value: newUnitsIntake });
        }
        if (BAClevelDoc.exists()) {
            batch.update(bacLevelRef, { value: newBACLevel });
        }

        // Delete the main date document
        const dateDocRef = doc(firestore, `${user.uid}/Alcohol Stuff/Entries/${dateStr}`);
        batch.delete(dateDocRef);

        // Commit the batch
        await batch.commit();
        console.log('All entries and date document deleted successfully.');
        setDialogVisible(false);
        fetchData(true);
    } catch (error) {
        console.error('Error deleting entries and updating totals:', error);
        alert('Failed to delete entries and update totals. Please try again.');
    }
};

  const onRefresh = () => {
    fetchData(true);
  };

  return (
    <SafeAreaView style={appStyles.fullScreen}>
      <View style={styles.container}>
        <BackButton />
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={() => handleCalenderClick()}>
            <Image
              source={require('./../../../../assets/images/calendar.png')}
              style={styles.calendarIcon}
              />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => fetchData(true)}
          >
          <Image
              source={require('./../../../../assets/images/refresh-icon.png')}
              style={styles.calendarIcon}
              />
        </TouchableOpacity>
      </View>
        {/* <Text style={styles.title}>History</Text> */}
        <FlatList
          data={dates}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.historyItem}
              onPress={() => handleDateClick(item.name)} // Handle date click
              onLongPress={() => handleLongPress(item)}
            >
              <LinearGradient
                colors={['#92DDFE', '#BAEAFF']} // Start and end colors
                style={styles.gradient}>
                <View style={styles.backgroundTextContainer}>
                  <Text style={styles.backgroundText}>
                    {moment(item.name, 'YYYY-MM-DD').format('dddd')} {/* Display day of the week */}
                  </Text>
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.dateText}>{moment(item.name).format('MMM Do')}</Text>
                  <Text style={styles.entriesCountText}>{`Entries: ${item.count}`}</Text>
                  <Text style={styles.entriesCountText}>{`Total Spent: £${item.totalSpent}`}</Text>
                  <Text style={styles.entriesCountText}>{`Total Units: ${item.totalUnits}`}</Text>
                </View>
              </LinearGradient>
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
      </View>

      {dialogVisible && (
        <Dialog.Container visible={true} contentStyle={dialogStyles.container}>
          <Dialog.Title style={dialogStyles.title}>History Options</Dialog.Title>
          <Dialog.Button style={dialogStyles.cancelButton} label="Cancel" onPress={handleCloseDialog} />
          <Dialog.Button style={dialogStyles.deleteButton} label="Delete" onPress={handleDelete} />
        </Dialog.Container>
      )}
    </SafeAreaView>
  );
};

export default HistoryScreen;

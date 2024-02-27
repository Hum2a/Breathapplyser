import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { HistoryStyles as styles } from '../../../styles/HistoryStyles/historyStyles';
import { UserContext } from '../../../../context/UserContext';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import moment from 'moment';
import { homeStyles } from '../../../styles/StartUpStyles/homeStyles';
import { appStyles } from '../../../styles/appStyles';

const HistoryScreen = ({ navigation }) => {
  const [dates, setDates] = useState([]); // Dates with entries
  const [dateEntries, setDateEntries] = useState([]); // Entries for the selected date
  const [dateEntryCounts, setDateEntryCounts] = useState({}); // Count of entries for each date
  const [selectedDate, setSelectedDate] = useState(null); // Selected date
  const { user } = useContext(UserContext);
  const firestore = getFirestore();

  // Fetch dates when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // // Fetch entries for the selected date when it changes
  // useEffect(() => {
  //   if (user && selectedDate) {
  //     fetchEntriesForDate(selectedDate);
  //   }
  // }, [user, selectedDate]);
  
  // const fetchDates = async () => {
  //   try {
  //     const querySnapshot = await getDocs(collection(firestore, user.uid, "Alcohol Stuff", "Entries"));
  //     const datesWithCountsPromises = querySnapshot.docs.map(async (doc) => {
  //       const dateStr = doc.id;
  //       const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs");
  //       const entriesSnapshot = await getDocs(entriesRef);
  //       return { id: doc.id, name: doc.id, count: entriesSnapshot.size }; // Include the count of entries
  //     });
  //     let datesWithCounts = await Promise.all(datesWithCountsPromises);
  
  //     // Sort the dates by most recent
  //     datesWithCounts = datesWithCounts.sort((a, b) => moment(b.name, 'YYYY-MM-DD').diff(moment(a.name, 'YYYY-MM-DD')));
  
  //     setDates(datesWithCounts); // Set the sorted dates along with their entry counts
  //   } catch (error) {
  //     console.error('Error fetching dates and their entry counts:', error);
  //   }
  // };

  const fetchData = async () => {
    try {
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
          totalSpent: totalSpent.toFixed(2), // Round to 2 decimal places
          totalUnits: totalUnits.toFixed(2)
        };
      });
  
      let datesWithDetails = await Promise.all(datesWithDetailsPromises);
  
      // Sort the dates by most recent
      datesWithDetails = datesWithDetails.sort((a, b) => moment(b.name, 'YYYY-MM-DD').diff(moment(a.name, 'YYYY-MM-DD')));
  
      setDates(datesWithDetails); // Set the sorted dates along with their entry details
    } catch (error) {
      console.error('Error fetching dates and their details:', error);
    }
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

  return (
    <SafeAreaView style={appStyles.fullScreen}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handleCalenderClick()}>
          <Image
            source={require('./../../../../assets/images/calendar.png')}
            style={homeStyles.smallIcon}
            />
        </TouchableOpacity>
        <Text style={styles.title}>History</Text>
        <FlatList
          data={dates}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.historyItem}
              onPress={() => handleDateClick(item.name)} // Handle date click
            >
              <View>
                <Text style={styles.dateText}>{item.name}</Text>
                <Text style={styles.entriesCountText}>{`Entries: ${item.count}`}</Text>
                <Text style={styles.entriesCountText}>{`Total Spent: $${item.totalSpent}`}</Text>
                <Text style={styles.entriesCountText}>{`Total Units: ${item.totalUnits}`}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;

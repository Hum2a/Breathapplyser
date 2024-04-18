import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { HistoryStyles as styles } from '../../../styles/HistoryStyles/historyStyles';
import { UserContext } from '../../../../context/UserContext';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import moment from 'moment';
import { homeStyles } from '../../../styles/StartUpStyles/homeStyles';
import { appStyles } from '../../../styles/AppStyles/appStyles';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

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


  const fetchData = async () => {
    const cacheKey = 'history_dates_with_details';
    try {
      // Attempt to retrieve the cached data
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
            style={styles.calendarIcon}
            />
        </TouchableOpacity>
        {/* <Text style={styles.title}>History</Text> */}
        <FlatList
          data={dates}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.historyItem}
              onPress={() => handleDateClick(item.name)} // Handle date click
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
                  <Text style={styles.dateText}>{item.name}</Text>
                  <Text style={styles.entriesCountText}>{`Entries: ${item.count}`}</Text>
                  <Text style={styles.entriesCountText}>{`Total Spent: $${item.totalSpent}`}</Text>
                  <Text style={styles.entriesCountText}>{`Total Units: ${item.totalUnits}`}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;

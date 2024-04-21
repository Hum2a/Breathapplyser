import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { HistoryStyles as styles } from '../../../styles/HistoryStyles/historyStyles';
import { UserContext } from '../../../../context/UserContext';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { appStyles } from '../../../styles/AppStyles/appStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryCalendar = ({ navigation }) => {
  const [dates, setDates] = useState([]); // Dates with entries
  const { user } = useContext(UserContext);
  const [dateEntries, setDateEntries] = useState([]); // New state for entries of the selected date
  const firestore = getFirestore();

  // Fetch dates when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async (forceRefresh = false) => {
    try {
      if (!forceRefresh) {
        // Attempt to load cached data first
        const cachedData = await AsyncStorage.getItem('history_dates_cache');
        if (cachedData) {
          const parsedCache = JSON.parse(cachedData);
          const cacheTime = new Date(parsedCache.timestamp);
          const now = new Date();
  
          // Check if cache is less than 24 hours old
          if (now.getTime() - cacheTime.getTime() < 24 * 60 * 60 * 1000) {
            setDates(parsedCache.dates);
            return; // Use cache and exit if it's still fresh
          }
        }
      }
  
      // Fetch new data if no cache, cache is outdated, or force refresh is true
      const querySnapshot = await getDocs(collection(firestore, user.uid, "Alcohol Stuff", "Entries"));
      const datesWithDetails = querySnapshot.docs.map((doc) => {
        const dateStr = doc.id;
        const totalSpent = doc.data().totalSpent;
        const totalUnits = doc.data().totalUnits;
        return {
          name: dateStr,
          count: doc.data().count,
          totalSpent: totalSpent ? totalSpent.toFixed(2) : '0.00',
          totalUnits: totalUnits ? totalUnits.toFixed(2) : '0.00'
        };
      });
  
      setDates(datesWithDetails);
  
      // Update the cache with new data
      await AsyncStorage.setItem('history_dates_cache', JSON.stringify({
        timestamp: new Date().toISOString(),
        dates: datesWithDetails
      }));
  
    } catch (error) {
      console.error('Error fetching or caching dates:', error);
    }
  };
  

  const fetchEntriesForDate = async (date) => {
    try {
      const dateStr = moment(date).format('YYYY-MM-DD');
      const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs");
      const querySnapshot = await getDocs(entriesRef);
      const entries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDateEntries(entries); // Update the state with the fetched entries
    } catch (error) {
      console.error('Error fetching entries for date:', error);
    }
  };

  const handleDateClick = (date) => {
    navigation.navigate('DetailedHistory', { date });
  };

  return (
    <SafeAreaView style={appStyles.fullScreen}>
      <View style={styles.container}>
        <Text style={styles.calendarTitle}>History Calendar</Text>
        <Calendar
          markedDates={{
              ...dates.reduce((markedDates, item) => {
              markedDates[item.name] = { marked: true, dotColor: 'red'}; // Adjust dot color for marked dates
              return markedDates;
              }, {}),
          }}
          style={styles.calendar}
          onDayPress={(day) => handleDateClick(day.dateString)}
          theme={{
            backgroundColor: '#ADD8E6', // Light blue background
            calendarBackground: '#ADD8E6', // Light blue calendar background
            textSectionTitleColor: '#5F9EA0', // Darker shade of light blue for month titles
            selectedDayBackgroundColor: '#007AFF', // Selected day background color
            selectedDayTextColor: '#ffffff', // White text color for selected day
            todayTextColor: '#00FFFF', // Cyan color for the current day
            dayTextColor: '#000000', // Black color for the day numbers
            textDisabledColor: '#d9e1e8', // Light grey for disabled days
            dotColor: '#007AFF', // Dot color for marked days
            selectedDotColor: '#ffffff', // White color for dots on selected day
            arrowColor: 'blue', // Blue color for the arrows
            monthTextColor: '#007AFF', // Blue color for the month text
            indicatorColor: '#007AFF', // Blue color for the loading indicator
            textDayFontFamily: 'Montserrat', // Your font family for day numbers
            textMonthFontFamily: 'Montserrat-Bold', // Your font family for month title
            textDayHeaderFontFamily: 'Montserrat', // Your font family for day headers
            textDayFontWeight: '300', // Font weight for day numbers
            textMonthFontWeight: 'bold', // Bold font weight for month title
            textDayHeaderFontWeight: '300', // Font weight for day headers
            textDayFontSize: 16, // Font size for day numbers
            textMonthFontSize: 20, // Font size for month title
            textDayHeaderFontSize: 16 // Font size for day headers
          }}
        />
        <TouchableOpacity 
          style={styles.updateButton}
          onPress={() => fetchData(true)} >
          <Image
            source={require('../../../../assets/images/refresh-icon.png')}
            style={styles.updateButtonImage} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HistoryCalendar;

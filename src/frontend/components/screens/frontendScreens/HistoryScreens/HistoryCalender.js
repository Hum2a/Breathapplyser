import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { HistoryStyles as styles } from '../../../styles/HistoryStyles/historyStyles';
import { UserContext } from '../../../../context/UserContext';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { appStyles } from '../../../styles/appStyles';

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

  const fetchData = async () => {
    try {
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
    } catch (error) {
      console.error('Error fetching dates:', error);
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
      </View>
    </SafeAreaView>
  );
};

export default HistoryCalendar;

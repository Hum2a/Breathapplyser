import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import moment from 'moment';

const HistoryCalendar = () => {
  const navigation = useNavigation();
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
      // Fetch data from Firestore
      const querySnapshot = await getDocs(collection(firestore, user.uid, "Alcohol Stuff", "Entries"));
      const datesWithDetails = querySnapshot.docs.map((doc) => {
        const dateStr = doc.id;
        const totalSpent = doc.data().totalSpent || 0;
        const totalUnits = doc.data().totalUnits || 0;
        return {
          date: dateStr,
          count: doc.data().count || 0,
          totalSpent: totalSpent.toFixed(2),
          totalUnits: totalUnits.toFixed(2)
        };
      });

      setDates(datesWithDetails);

    } catch (error) {
      console.error('Error fetching dates:', error);
    }
  };

  const handleDateClick = (date) => {
    navigation.navigate('DetailedHistory', { date });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.calendarTitle}>History Calendar</Text>
      <Calendar
        markedDates={dates.reduce((markedDates, item) => {
          markedDates[item.date] = { marked: true, dotColor: '#007AFF' }; // Adjust dot color for marked dates
          return markedDates;
        }, {})}
        style={styles.calendar}
        onDayPress={(day) => handleDateClick(day.dateString)}
        theme={{
          backgroundColor: '#F0F8FF', // Light blue background
          calendarBackground: '#F0F8FF', // Light blue calendar background
          textSectionTitleColor: '#008080', // Dark teal color for month titles
          selectedDayBackgroundColor: '#008080', // Selected day background color
          selectedDayTextColor: '#ffffff', // White text color for selected day
          todayTextColor: '#00CED1', // Dark cyan color for the current day
          dayTextColor: '#000000', // Black color for the day numbers
          textDisabledColor: '#d9e1e8', // Light grey for disabled days
          dotColor: '#008080', // Dot color for marked days
          selectedDotColor: '#ffffff', // White color for dots on selected day
          arrowColor: '#008080', // Dark teal color for the arrows
          monthTextColor: '#008080', // Dark teal color for the month text
          indicatorColor: '#008080', // Dark teal color for the loading indicator
          textDayFontFamily: 'Roboto', // Your font family for day numbers
          textMonthFontFamily: 'Roboto-Bold', // Your font family for month title
          textDayHeaderFontFamily: 'Roboto', // Your font family for day headers
          textDayFontWeight: '300', // Font weight for day numbers
          textMonthFontWeight: 'bold', // Bold font weight for month title
          textDayHeaderFontWeight: '300', // Font weight for day headers
          textDayFontSize: 16, // Font size for day numbers
          textMonthFontSize: 20, // Font size for month title
          textDayHeaderFontSize: 16 // Font size for day headers
        }}
      />
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => fetchData(true)}
      >
        <Image
          source={require('../../../../assets/images/refresh-icon.png')}
          style={styles.refreshButtonImage}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  calendarTitle: {
    fontSize: 24,
    fontFamily: 'my_coffee_break',
    marginBottom: 20,
    color: '#008080',
  },
  calendar: {
    marginBottom: 20,
  },
  refreshButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 10,
  },
  refreshButtonImage: {
    width: 24,
    height: 24,
  },
});

export default HistoryCalendar;

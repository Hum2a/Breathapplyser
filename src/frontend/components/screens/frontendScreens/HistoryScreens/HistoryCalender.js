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
        <Text style={styles.title}>History Calendar</Text>
        <Calendar
          markedDates={{
              ...dates.reduce((markedDates, item) => {
              markedDates[item.name] = { marked: true, dotColor: 'red'}; // Adjust dot color for marked dates
              return markedDates;
              }, {}),
          }}
          onDayPress={(day) => handleDateClick(day.dateString)}
          theme={{
            backgroundColor: '#282c34', // Dark background for contrast
            calendarBackground: '#282c34', // Matching calendar background
            textSectionTitleColor: '#9FB3C8', // Subtle blue for month titles
            textSectionTitleDisabledColor: '#555e68', // Disabled color for non-active months
            selectedDayBackgroundColor: '#DAA520', // Gold color for selected day
            selectedDayTextColor: '#282c34', // Dark text on selected day for contrast
            todayTextColor: '#FF6347', // Tomato color for today
            dayTextColor: '#CCCCCC', // Light grey for days
            textDisabledColor: '#555e68', // Disabled day color
            dotColor: '#DAA520', // Dot color matching selected day
            selectedDotColor: '#282c34', // Dark color for dots on selected day
            arrowColor: '#DAA520', // Gold color for navigation arrows
            disabledArrowColor: '#555e68', // Disabled navigation arrow
            monthTextColor: '#FFD700', // Gold color for the month text
            indicatorColor: 'blue', // Indicator for loading or other statuses
            textDayFontWeight: '500', // Medium weight for day text
            textMonthFontWeight: 'bold', // Bold for month text for emphasis
            textDayHeaderFontWeight: '500', // Medium weight for day headers
            textDayFontSize: 16, // Standard size for day text
            textMonthFontSize: 24, // Larger size for month to stand out
            textDayHeaderFontSize: 16, // Standard size for day headers
            'stylesheet.calendar.header': {
                week: {
                    marginTop: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: 10, // Add padding for visual spacing
                },
                dayHeader: {
                    marginTop: 2,
                    marginBottom: 7,
                    color: '#9FB3C8', // Use the subtle blue for headers
                    fontSize: 16,
                    fontWeight: 'bold', // Bold headers for clarity
                },
            },
            'stylesheet.day.basic': {
                selected: {
                    backgroundColor: '#DAA520',
                    borderRadius: 50, // Circular selection for a modern look
                },
                today: {
                    borderColor: '#FF6347',
                    borderWidth: 2, // Border for today without filling background
                    borderRadius: 50,
                },
                todayText: {
                    color: '#FF6347',
                    fontWeight: 'bold',
                },
                dot: {
                    width: 6,
                    height: 6,
                    marginTop: 1,
                    borderRadius: 3,
                },
            },
        }}        
          />
      </View>
    </SafeAreaView>
  );
};

export default HistoryCalendar;

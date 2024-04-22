import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import moment from 'moment';

const NightOutCalendarScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const firestore = getFirestore();
  const { user } =  useContext(UserContext);

  useEffect(() => {
    const fetchEntryDates = async () => {
      try {
        const entryDatesCollection = collection(firestore, user.uid, 'Alcohol Stuff', 'Entries');
        const querySnapshot = await getDocs(entryDatesCollection);

        const dates = {};
        querySnapshot.forEach((doc) => {
          // Extract the date from the document ID
          const date = doc.id;
          // Mark the date as having an entry
          dates[date] = { marked: true };
        });

        // Update the marked dates state
        setMarkedDates(dates);
      } catch (error) {
        console.error('Error fetching entry dates:', error);
      }
    };

    fetchEntryDates();
  }, [firestore]);

  const handleDatePress = (date) => {
    console.log('Selected Date:', date);
    // Navigate to CurrentNightOut screen and pass the selected date as a parameter
    navigation.navigate('CurrentNight', { date: date });
  };
  

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => handleDatePress(day.dateString)}
        markedDates={markedDates}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#00adf5',
          selectedDotColor: '#ffffff',
          arrowColor: '#00adf5',
          monthTextColor: '#00adf5',
          indicatorColor: 'blue',
          textDayFontFamily: 'monospace',
          textMonthFontFamily: 'monospace',
          textDayHeaderFontFamily: 'monospace',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16
        }}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CurrentNight', { selectedDate })}
      >
        <Text style={styles.buttonText}>View Current Night Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  button: {
    padding: 15,
    backgroundColor: '#00adf5',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default NightOutCalendarScreen;

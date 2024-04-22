import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
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
    <View style={{ flex: 1 }}>
      <Calendar
        onDayPress={(day) => handleDatePress(day.dateString)}
        markedDates={markedDates}
      />
      <TouchableOpacity
        style={{ padding: 10, backgroundColor: 'blue', alignItems: 'center' }}
        onPress={() => navigation.navigate('CurrentNight', { selectedDate })}
      >
        <Text style={{ color: 'white' }}>View Current Night Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NightOutCalendarScreen;

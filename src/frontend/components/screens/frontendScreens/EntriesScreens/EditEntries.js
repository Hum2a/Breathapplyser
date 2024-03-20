import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TimePickerModal } from 'react-native-paper-dates';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import { editEntryStyles as styles } from '../../../styles/HistoryStyles/editStyles';
import moment from 'moment';

const EditEntryScreen = ({ route, navigation }) => {
  const { entry } = route.params;
  const [date, setDate] = useState(new Date(entry.date));
  const [startTime, setStartTime] = useState(new Date(entry.startTime)); // Assuming entry has startTime
  const [endTime, setEndTime] = useState(new Date(entry.endTime)); // Assuming entry has endTime
  const [amount, setAmount] = useState(entry.amount.toString()); // Assuming entry has amount
  const [alcohol, setAlcohol] = useState(entry.alcohol); // Assuming entry has alcohol
  const [units, setUnits] = useState(entry.units.toString()); // Assuming entry has units
  const [price, setPrice] = useState(entry.price.toString()); // Assuming entry has price
  const [type, setType] = useState(entry.type); // Assuming entry has type
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const firestore = getFirestore();
  const { user } = useContext(UserContext);
  const dateStr = moment(entry.date).format('YYYY-MM-DD');

  const handleUpdateEntry = async () => {
    const entryRef = doc(firestore, `${user.uid}/Alcohol Stuff/Entries/${dateStr}/EntryDocs`, entry.id);
    const updatedEntry = {
      date,
      startTime,
      endTime,
      amount: parseFloat(amount),
      alcohol,
      units: parseFloat(units),
      price: parseFloat(price),
      type,
      // You may need to add more fields or conversions depending on your data model
    };
    try {
      await updateDoc(entryRef, updatedEntry);
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const toggleStartTimePicker = () => {
    setShowStartTimePicker(!showStartTimePicker);
  };

  const toggleEndTimePicker = () => {
    setShowEndTimePicker(!showEndTimePicker);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const onChangeStartTime = (event, selectedTime) => {
    setShowStartTimePicker(false);
    const currentTime = selectedTime || startTime;
    setStartTime(currentTime);
  };

  const onChangeEndTime = (event, selectedTime) => {
    setShowEndTimePicker(false);
    const currentTime = selectedTime || endTime;
    setEndTime(currentTime);
  };

  const onChangeDate = (event, selectedDate) =>{
    setShowDatePicker(false);
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Entry</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Date</Text>
        <TouchableOpacity style={styles.input} onPress={toggleDatePicker}>
          <Text style={styles.dateTimeText}>{moment(date).format('YYYY-MM-DD')}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          maximumDate={new Date()} // Disallow future dates
        />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Start Time</Text>
        <TouchableOpacity style={styles.input} onPress={toggleStartTimePicker}>
          <Text style={styles.dateTimeText} >{moment(startTime).format('HH:mm')}</Text>
        </TouchableOpacity>
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeStartTime}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>End Time</Text>
        <TouchableOpacity style={styles.input} onPress={toggleEndTimePicker}>
          <Text style={styles.dateTimeText}>{moment(endTime).format('HH:mm')}</Text>
        </TouchableOpacity>
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeEndTime}
          />
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Drink</Text>
        <TextInput
          style={styles.input}
          value={alcohol}
          onChangeText={setAlcohol}
          placeholder="Drink"
        />
        </View>
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Units</Text>
            <TextInput
            style={styles.input}
            value={units}
            onChangeText={setUnits}
            placeholder="Units"
            />
        </View>
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Price</Text>
            <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="Price"
            />
        </View>
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Type</Text>
            <TextInput
            style={styles.input}
            value={type}
            onChangeText={setType}
            placeholder="Type"
            />
        </View>
      <TouchableOpacity style={styles.button} onPress={handleUpdateEntry}>
        <Text style={styles.buttonText}>Update Entry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditEntryScreen;

import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TimePickerModal, en } from 'react-native-paper-dates';
import { getFirestore, doc, updateDoc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import { editEntryStyles as styles } from '../../../styles/HistoryStyles/editStyles';
import moment from 'moment';
import calculateBACIncrease from '../../../../utils/calculations/calculateBAC';

const EditEntryScreen = ({ route, navigation }) => {
  const { entry } = route.params;
  const [date, setDate] = useState(new Date(entry.date));
  const [startTime, setStartTime] = useState(new Date(entry.startTime));
  const [endTime, setEndTime] = useState(new Date(entry.endTime));
  const [amount, setAmount] = useState(entry.amount.toString());
  const [calories, setCalories] = useState(entry.calories.toString());
  const [alcohol, setAlcohol] = useState(entry.alcohol);
  const [units, setUnits] = useState(entry.units.toString());
  const [price, setPrice] = useState(entry.price.toString());
  const [type, setType] = useState(entry.type);
  const [bac, setBac] = useState(entry.BACIncrease);
  const [drunkennessLevel, setDrunkennessLevel] = useState(entry.drunkennessLevel);
  const [timestamp, setTimestamp] = useState(entry.timestamp);
  const [selectedCurrency, setSelectedCurrency] = useState(entry.selectedCurrency);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const firestore = getFirestore();
  const { user } = useContext(UserContext);
  const [userProfile, setUserProfile] = useState(null);
  const dateStr = moment(entry.date).format('YYYY-MM-DD');

  useEffect(() => {
    fetchUserProfile();
  }, []);

const handleUpdateEntry = async () => {
  const newDateStr = moment(date).format('YYYY-MM-DD'); // Use the state `date` which holds the new date
  const oldDateStr = moment(entry.date).format('YYYY-MM-DD'); // Original date from entry

  const oldEntryRef = doc(firestore, `${user.uid}/Alcohol Stuff/Entries/${oldDateStr}/EntryDocs`, entry.id);
  const oldEntryRefCollection = doc(firestore, `${user.uid}/Alcohol Stuff/Entries/${oldDateStr}`);
  const newEntryRef = doc(firestore, `${user.uid}/Alcohol Stuff/Entries/${newDateStr}/EntryDocs`, entry.id);
  const newEntryRefCollection = doc(firestore, `${user.uid}/Alcohol Stuff/Entries/${newDateStr}`);

  const BACIncrease = calculateBACIncrease(units, userProfile);
  const updatedEntry = {
    date,
    startTime: moment(startTime, 'HH:mm').toISOString(),
    endTime: moment(endTime, 'HH:mm').toISOString(),
    BACIncrease,
    amount: parseFloat(amount),
    alcohol,
    calories: parseInt(calories),
    units: parseFloat(units),
    price: parseFloat(price),
    type,
    drunkennessLevel,
    timestamp,
    selectedCurrency,
    user_id: user.uid
  };

  try {

    await updateDailyTotals(user, oldDateStr, {
      ...entry,
      amount: -entry.amount,  // Negate the old values to subtract
      units: -entry.units,
      BACIncrease: -entry.BACIncrease
    });

    if (oldDateStr !== newDateStr) {
      // If the dates are different, move the document
      await setDoc(oldEntryRefCollection, { lastUpdated: new Date() }, { merge: true });
      await setDoc(newEntryRefCollection, { lastUpdated: new Date() }, { merge: true });
      await setDoc(newEntryRef, updatedEntry);  // Create the entry in the new location
      await deleteDoc(oldEntryRef);  // Delete the entry from the old location
      await updateDailyTotals(user, newDateStr, updatedEntry);
    } else {
      // If the dates are the same, just update the existing document
      await setDoc(oldEntryRefCollection, { lastUpdated: new Date() }, { merge: true });
      await updateDoc(oldEntryRef, updatedEntry);
      await updateDailyTotals(user, oldDateStr, updatedEntry);
    }
    navigation.goBack();  // Go back to the previous screen
  } catch (error) {
    console.error('Error updating entry:', error);
  }
};


  const fetchUserProfile = async () => {
    if (user) {
      const docRef = doc(firestore, user.uid, "Profile");

      try {
        const promise = getDoc(docRef);
        const timeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out')), 5000) // 5 seconds timeout
        );
        const docSnap = await Promise.race([promise, timeout]);
  
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
          console.log('userProfile retrieved');
          // Use userProfile for BAC calculations and other operations
        } else {
          console.log("No such profile document!");
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    }
  };

  // Update or adjust daily totals
  const updateDailyTotals = async (user, dateStr, entry) => {
    console.log("Update Daily Totals Called");
    const amountSpentRef = doc(firestore, user.uid, "Daily Totals", "Amount Spent", dateStr);
    const unitsIntakeRef = doc(firestore, user.uid, "Daily Totals", "Unit Intake", dateStr);
    const bacLevelRef = doc(firestore, user.uid, "Daily Totals", "BAC Level", dateStr);

    try {
      const amountSpentDoc = await getDoc(amountSpentRef);
      const unitsIntakeDoc = await getDoc(unitsIntakeRef);
      const bacLevelDoc = await getDoc(bacLevelRef);
      console.log("Refs retrieved");

      const existingAmountSpent = amountSpentDoc.exists() ? amountSpentDoc.data().value : 0;
      const existingUnitsIntake = unitsIntakeDoc.exists() ? unitsIntakeDoc.data().value : 0;
      const existingBACLevel = bacLevelDoc.exists() ? bacLevelDoc.data().value : 0;
      console.log("existing levels retrieved, Amount Spent: ", existingAmountSpent, " Units Intake: ", existingUnitsIntake, " BAC Level: ", existingBACLevel);


      const newAmountSpent = existingAmountSpent + parseFloat(entry.amount * entry.price);
      const newUnitsIntake = existingUnitsIntake + parseFloat(entry.units);
      const newBACLevel = existingBACLevel + parseFloat(entry.BACIncrease);
      console.log("new levels decided, Amount Spent: ", newAmountSpent, " Units Intake: ", newUnitsIntake, " BAC Level: ", newBACLevel);

      await setDoc(amountSpentRef, { value: newAmountSpent }, { merge: true });
      await setDoc(unitsIntakeRef, { value: newUnitsIntake }, { merge: true });
      await setDoc(bacLevelRef, { value: newBACLevel }, { merge: true });
      console.log("doc set");
    } catch (error) {
      console.error('Error updating daily totals:', error);
      throw new Error('Could not update daily totals.');
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
          maximumDate={new Date()}
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
          placeholderTextColor='black'
        />
        </View>
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Units</Text>
            <TextInput
            style={styles.input}
            value={units}
            onChangeText={setUnits}
            placeholder="Units"
            placeholderTextColor='black'
            />
        </View>
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Price</Text>
            <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="Price"
            placeholderTextColor='black'
            />
        </View>
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Type</Text>
            <TextInput
            style={styles.input}
            value={type}
            onChangeText={setType}
            placeholder="Type"
            placeholderTextColor='black'
            />
        </View>
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Calories</Text>
            <TextInput
            style={styles.input}
            value={calories}
            onChangeText={setCalories}
            placeholder="Calories"
            placeholderTextColor='black'
            />
        </View>
      <TouchableOpacity style={styles.button} onPress={handleUpdateEntry}>
        <Text style={styles.buttonText}>Update Entry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditEntryScreen;

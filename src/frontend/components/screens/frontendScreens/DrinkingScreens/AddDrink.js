import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated, Easing, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { addStyles } from '../../../styles/DrinkingStyles/addStyles';
import { TimePickerModal } from 'react-native-paper-dates';
import { sendNotification } from '../../../../utils/notifications';
import calculateBACIncrease from '../../../../utils/calculations/calculateBAC';
import { UserContext } from '../../../../context/UserContext';
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, updateDoc, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { isFutureTime, validateAmount, validateUnits, validatePrice } from '../../../../../backend/app/utils/validations/addEntryValidation';
import { useShakeAnimation, useColourFlashAnimation } from '../../../animations/illegalTime';
import { currencies } from '../../../../utils/config/currencies';
import { saveEntry } from '../../../../../backend/firebase/queries/saveEntry';
import { saveBACLevel } from '../../../../../backend/firebase/queries/saveBACLevel';
import { StartTimeButton, EndTimeButton, DatePickerButton, SaveEntryButton, PickFromFavouritesButton, AddToFavouritesButton  } from '../../../buttons/AddEntryComponents/AddEntryScreenButtons';
import { AlcoholInput, TypeInput, AmountInput, UnitsInput, PriceInput } from '../../../buttons/AddEntryComponents/AddEntryInputs';
import { CurrencyPicker } from '../../../buttons/AddEntryComponents/AddEntryPickers';
import { addEntryToFavourites } from '../../../../../backend/app/utils/handles/addToFavourites';

const AddEntryScreen = ({ navigation }) => {
  const [drinks, setDrinks] = useState([]);
  const [amount, setAmount] = useState('1');
  const [alcohol, setAlcohol] = useState();
  const [units, setUnits] = useState();
  const [price, setPrice] = useState();
  const [type, setType] = useState('Spirit');
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);// New state for selected date
  const [selectedStartTime, setSelectedStartTime] = useState(moment().format('HH:mm'));
  const [selectedEndTime, setSelectedEndTime] = useState(moment().format('HH:mm'));
  const [totalDrinks, setTotalDrinks] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState('GBP');
  const [amountSpent, setAmountSpent] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const { shakeAnimation, runShakeAnimation } = useShakeAnimation();
  const { colorAnimation, runColourFlashAnimation } = useColourFlashAnimation();
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const firestore = getFirestore();

  const { user } = useContext(UserContext);


const handleStartTimeConfirm = (time) => {
  const formattedTime = moment(time).format('HH:mm');
  const combinedDateTime = moment(`${selectedDate} ${formattedTime}`);
  if (isFutureTime(combinedDateTime)) {
    runShakeAnimation();
    runColourFlashAnimation();
    alert("Future times are not allowed.");
    return;
  }
  setSelectedStartTime(formattedTime);
  hideStartTimePicker();
};

const handleEndTimeConfirm = (time) => {
  const formattedTime = moment(time).format('HH:mm');
  const combinedDateTime = moment(`${selectedDate} ${formattedTime}`);
  if (isFutureTime(combinedDateTime)) {
    runShakeAnimation();
    runColourFlashAnimation();
    alert("Future times are not allowed.");
    return;
  }
  setSelectedEndTime(formattedTime);
  hideEndTimePicker();
};


  const handleDateChange = (event, selectedDate) => {
    setDatePickerVisible(false); // Hide the date picker

    const currentDate = selectedDate || new Date(); // Use selected date or current date
    if (currentDate > new Date()) {
      // If the selected date is in the future, show an alert and do not update the date
      Alert.alert("Invalid Date", "Future dates are not allowed.");
      return;
    }
    setSelectedDate(currentDate); // Update the selected date
  };

  const handleAddToFavourites = () => {
    const drinkData = {
      alcohol,
      amount,
      price,
      type,
      units,
    };
  
    addEntryToFavourites(user, drinkData); // Pass the user object and drink data to addToFavorites
  };

  const handlePickFromFavourites = () => {
    navigation.navigate('PickFavourites', { navigation }); // Pass navigation as a parameter
  };

  const handleBarcodeScan = () => {
    navigation.navigate('BarcodeScan'); // Navigate to BarcodeScan screen
  };

  useEffect(() => {
    console.log("useEffect called");

    const fetchUserProfile = async () => {
      console.log("fetchUserProfile called");
      if (user) {
        console.log('User found');
        const docRef = doc(firestore, user.uid, "Profile");
        console.log('docRef initialised');
    
        try {
          const promise = getDoc(docRef);
          const timeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timed out')), 5000) // 5 seconds timeout
          );
          const docSnap = await Promise.race([promise, timeout]);
          console.log('docSnap initialised');
    
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
  
    fetchUserProfile();
    handleCheckLimits();
  }, []);

  useEffect(() => {
    const fetchTotals = async () => {
      const selectedDateStr = moment().format('YYYY-MM-DD');
      
      // Define references to the Firestore documents
      const drinksRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", selectedDateStr, "EntryDocs");
      const amountSpentRef = doc(firestore, user.uid, "Daily Totals", "Amount Spent", selectedDateStr);
      const unitsIntakeRef = doc(firestore, user.uid, "Daily Totals", "Unit Intake", selectedDateStr);

      try {
        // Fetch total drinks
        const drinksSnapshot = await getDocs(drinksRef);
        setTotalDrinks(drinksSnapshot.docs.length); // Assuming each document in EntryDocs represents a drink

        // Fetch total spending
        const amountSpentSnapshot = await getDoc(amountSpentRef);
        if (amountSpentSnapshot.exists()) {
          setTotalSpending(amountSpentSnapshot.data().value);
        } else {
          setTotalSpending(0);
        }

        // Fetch total units
        const unitsIntakeSnapshot = await getDoc(unitsIntakeRef);
        if (unitsIntakeSnapshot.exists()) {
          setTotalUnits(unitsIntakeSnapshot.data().value);
        } else {
          setTotalUnits(0);
        }
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    };

    if (user) {
      fetchTotals();
    }
  }, [selectedDate, user]);

  const handleSaveEntry = async () => {
    console.log("handleSaveEntry called");
    console.log("Current state:", { amount, units, price, alcohol, type, selectedStartTime, selectedEndTime,});
    if (!validateAmount(amount) || !validateUnits(units) || !validatePrice(price)) {
      alert('Please enter valid values for Amount, Units, and Price.');
      return;
    }
  
    if (!user) {
      console.error("User data is not available");
      return;
    }
  
    // Convert the selected amount to a number
    const selectedAmount = parseInt(amount);
    const entryDetailsArray = []; // Declare an array to store entryDetails
  
    // Create multiple entries based on the selected amount
    for (let i = 0; i < selectedAmount; i++) {
      // Your entry details here
      const entryDetails = {
        alcohol, amount: 1, units, price, type, selectedStartTime, selectedEndTime, selectedDate, selectedCurrency
      };
  
      entryDetailsArray.push(entryDetails); // Add entryDetails to the array
  
      await saveEntry(user, userProfile, entryDetails);
  
      const bacUpdateDetails = {
        selectedStartTime, selectedEndTime, selectedDate
      };
  
      await saveBACLevel(user, units, userProfile, bacUpdateDetails);
  
      const BACIncrease = calculateBACIncrease(units, userProfile);
      entryDetails.BACIncrease = BACIncrease;
    }
  
    // Now you can use entryDetailsArray for further processing or outside of the loop
  
    // For example, you can access the first entryDetails like this:
    console.log("First entryDetails:", entryDetailsArray[0]);
  
    // Update total amounts for the day
    const selectedDateStr = moment(selectedDate).format('YYYY-MM-DD');
    const amountSpentRef = doc(firestore, user.uid, "Daily Totals", "Amount Spent", `${selectedDateStr}`);
    const unitsIntakeRef = doc(firestore, user.uid, "Daily Totals", "Unit Intake", `${selectedDateStr}`);
    const bacLevelRef = doc(firestore, user.uid, "Daily Totals", "BAC Level", `${selectedDateStr}`);
  
    try {
      // Fetch existing values
      const amountSpentDoc = await getDoc(amountSpentRef);
      const unitsIntakeDoc = await getDoc(unitsIntakeRef);
      const bacLevelDoc = await getDoc(bacLevelRef);
  
      // Existing values or default to 0 if not present
      const existingAmountSpent = amountSpentDoc.exists() ? amountSpentDoc.data().value : 0;
      const existingUnitsIntake = unitsIntakeDoc.exists() ? unitsIntakeDoc.data().value : 0;
      const existingBACLevel = bacLevelDoc.exists() ? bacLevelDoc.data().value : 0;
  
      // Calculate new totals
      const newAmountSpent = existingAmountSpent + entryDetailsArray.reduce((total, entry) => total + (entry.amount * entry.price), 0);
      const newUnitsIntake = existingUnitsIntake + entryDetailsArray.reduce((total, entry) => total + parseInt(entry.units), 0);
      const newBACLevel = existingBACLevel + entryDetailsArray.reduce((total, entry) => total + parseFloat(entry.BACIncrease), 0);
  
      // Update and save new values
      await setDoc(amountSpentRef, { value: newAmountSpent, lastUpdated: moment().format('YY-MM-DD HH:mm:ss')}, { merge: true });
      await setDoc(unitsIntakeRef, { value: newUnitsIntake, lastUpdated: moment().format('YY-MM-DD HH:mm:ss')}, { merge: true });
      await setDoc(bacLevelRef, { value: newBACLevel, lastUpdated: moment().format('YY-MM-DD HH:mm:ss')}, { merge: true });
    } catch (error) {
      console.error('Error updating daily totals:', error);
      Alert.alert('Error', 'Could not update daily totals.');
    }
  
    const selectedCurrencyAmountSpent = amount * price;
    const updatedAmountSpent = { ...amountSpent, [selectedCurrency]: selectedCurrencyAmountSpent };
    setAmountSpent(updatedAmountSpent);
  
    navigation.navigate('Home');
  };
const handleCheckLimits = async () => {
  console.log("handleCheckLimits called");

  if (!user) {
    console.error("User data is not available");
    return;
  }

  const selectedDateStr = moment(selectedDate).format('YYYY-MM-DD'); // Format the date as 'YYYY-MM-DD'

  // Fetch entries from Firestore for the specific date
  const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", selectedDateStr, "EntryDocs");
  try {
    const entriesSnapshot = await getDocs(entriesRef);
    const entriesData = entriesSnapshot.docs.map(doc => doc.data());

    // Fetch user Limits from Firestore
    const LimitsRef = doc(firestore, user.uid, "Limits");
    const LimitsSnapshot = await getDoc(LimitsRef);
    if (!LimitsSnapshot.exists()) {
      console.error("No Limits document found!");
      return;
    }
    const { spendingLimit, drinkingLimit } = LimitsSnapshot.data();

    // Calculate total drinks, units, and spending for the specific date
    const totalDrinks = entriesData.reduce((total, entry) => total + parseFloat(entry.amount), 0);
    const totalUnits = entriesData.reduce((total, entry) => total + parseInt(entry.units), 0);
    const totalSpending = entriesData.reduce((total, entry) => total + (parseFloat(entry.price) * parseFloat(entry.amount)), 0);

    setTotalDrinks(totalDrinks);
    setTotalUnits(totalUnits);
    setTotalSpending(totalSpending);

    // Check against limits from Firestore
    if (totalSpending > spendingLimit) {
      sendNotification('Spending Limit Reached', 'You have exceeded your spending limit.');
    }
    if (totalDrinks > drinkingLimit) {
      sendNotification('Drinking Limit Reached', 'You have reached your drinking limit.');
    }
  } catch (error) {
    console.error("Error fetching entries or limits:", error);
  }
};


  const showStartTimePicker = () => {
    console.log("showStartTimePicker called");
    setStartTimePickerVisible(true);
  };

  const showEndTimePicker = () => {
    console.log("showEndTimePicker called");
    setEndTimePickerVisible(true);
  };

  const hideStartTimePicker = () => {
    console.log("hideStartTimePicker called");
    setStartTimePickerVisible(false);
  };

  const hideEndTimePicker = () => {
    console.log("hideEndTimePicker called");
    setEndTimePickerVisible(false);
  };

  const updateFieldsFilledStatus = () => {
    // Check if all required fields have values
    if (alcohol && amount && units && price && selectedStartTime && selectedEndTime) {
      setAllFieldsFilled(true);
    } else {
      setAllFieldsFilled(false);
    }
  };

   // Use the useEffect hook to listen for changes in input fields
   useEffect(() => {
    updateFieldsFilledStatus();
  }, [alcohol, amount, units, price, selectedStartTime, selectedEndTime]);


  const containerStyle = {
    ...addStyles.container,
    transform: [{ translateX: shakeAnimation }],
    backgroundColor: colorAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['white', 'red'], // Change 'white' to your default background color
    }),
  };
  const drinkTypes = ['Spirit', 'Beer', 'Lager', 'Wine', 'Liquers', 'Cocktail'];


  return (
    <ScrollView contentContainerStyle={addStyles.scrollContainer}>
      <Animated.View style={containerStyle}>
        <Text style={addStyles.title}>Add Entry</Text>

        <View style={addStyles.statsContainer}>
          <Text style={addStyles.statText}>Total Drinks: {totalDrinks}</Text>
          <Text style={addStyles.statText}>Units: {totalUnits}</Text>
          <Text style={addStyles.statText}>Spending: {totalSpending}</Text>
        </View>
        
        {/* <View style={addStyles.favouriteButtonsContainer}>
          <AddToFavouritesButton onPress={handleAddToFavourites} />
          <PickFromFavouritesButton onPress={handlePickFromFavourites} />
        </View>
         */}
        <AlcoholInput value={alcohol} onChangeText={setAlcohol} />
        <>
          <Picker
            selectedValue={type}
            style={addStyles.picker}
            onValueChange={(itemValue, itemIndex) => setType(itemValue)}
          >
            {drinkTypes.map((type, index) => (
              <Picker.Item key={index} label={type} value={type} />
            ))}
          </Picker>

          <Picker
            selectedValue={amount}
            style={addStyles.picker}
            onValueChange={(itemValue, itemIndex) => setAmount(itemValue)}
          >
            {[...Array(9).keys()].map((n) => (
              <Picker.Item key={n} label={`${n + 1}`} value={n + 1} />
            ))}
          </Picker>
        </>

        <UnitsInput value={units} onChangeText={setUnits} />

        <View style={addStyles.priceInputContainer}>
          <TextInput
            style={addStyles.priceInput}
            placeholder="Price"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <CurrencyPicker
            selectedValue={selectedCurrency}
            onValueChange={setSelectedCurrency}
            currencies={currencies}
            style={addStyles.currencyPicker}
          />
        </View>


        <Text style={addStyles.timeText}>{`Start Time: ${selectedStartTime}`}</Text>
        <StartTimeButton onPress={showStartTimePicker} />
    
        <Text style={addStyles.timeText}>{`End Time: ${selectedEndTime}`}</Text>
        <EndTimeButton onPress={showEndTimePicker} />

        <Text style={addStyles.timeText}>{`Date: ${selectedDate}`}</Text>
        <DatePickerButton onPress={() => setDatePickerVisible(true)} />

        <TimePickerModal
          visible={isStartTimePickerVisible}
          onDismiss={hideStartTimePicker}
          onConfirm={handleStartTimeConfirm}
          label="Select Start Time"
          cancelLabel="Cancel"
          confirmLabel="Confirm"
        />
        <TimePickerModal
          visible={isEndTimePickerVisible}
          onDismiss={hideEndTimePicker}
          onConfirm={handleEndTimeConfirm}
          label="Select End Time"
          cancelLabel="Cancel"
          confirmLabel="Confirm"
        />
        {isDatePickerVisible && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()} // Disallow future dates
          />
        )}

        {allFieldsFilled && (
          <SaveEntryButton onPress={handleSaveEntry} />
        )}

        {allFieldsFilled && (
          <AddToFavouritesButton onPress={handleAddToFavourites} />
        )}

        <PickFromFavouritesButton onPress = {handlePickFromFavourites} />
{/* 
        <TouchableOpacity style={addStyles.scanButton} onPress={handleBarcodeScan}>
          <Text style={addStyles.scanButtonText}>Scan Barcode</Text>
        </TouchableOpacity> */}

        <View style={addStyles.amountSpentContainer}>
          {currencies.map((currency) => (
            <Text key={currency.value}>
              {currency.label}: {amountSpent[currency.value] || 0}
            </Text>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
};

export default AddEntryScreen;

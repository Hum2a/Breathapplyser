import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import axios from 'axios';
import { saveDataToFile, globalData } from '../../../utils/database';
import { addStyles } from '../../styles/styles';
import { TimePickerModal } from 'react-native-paper-dates';
import { sendNotification } from '../../../utils/notifications';
import calculateBACIncrease from '../../../utils/calculations/calculateBAC';
import { UserContext } from '../../../context/UserContext';
import getServerBaseUrl from '../../../utils/config/dbURL';


const AddEntryScreen = ({ navigation }) => {
  const [drinks, setDrinks] = useState([]);
  const [amount, setAmount] = useState('1');
  const [alcohol, setAlcohol] = useState('Vodka');
  const [units, setUnits] = useState('5');
  const [price, setPrice] = useState('4');
  const [type, setType] = useState('Drink');
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(moment().format('HH:mm'));
  const [selectedEndTime, setSelectedEndTime] = useState(moment().format('HH:mm'));
  const [totalDrinks, setTotalDrinks] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState('GBP');
  const [amountSpent, setAmountSpent] = useState({});

  const currencies = [
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'GBP', value: 'GBP' },
    // Add more currencies here...
  ];

  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
          const baseUrl = getServerBaseUrl();

          const drinksResponse = await fetch(`${baseUrl}/api/drinks`);
          setDrinks(await drinksResponse.json());

          const currenciesResponse = await fetch(`${baseUrl}/api/currencies`);
          setCurrencies(await currenciesResponse.json());
      } catch (error) {
          console.error('AddEntry.js: Error fetching data:', error);
      }
  };

  fetchData();
  handleCheckLimits();
}, []);

  const handleSaveEntry = async () => {
    if (!validateAmount(amount) || !validateUnits(units) || !validatePrice(price)) {
      alert('Please enter valid values for Amount, Units, and Price.');
      return;
    }

    if (!user || !user.profile) {
      console.error("AddEntry.js User data is not available");
      return;
    }

    const entry = {
      user_id: user.id,  // Use the user ID from the context
      alcohol: alcohol,
      amount: parseInt(amount),
      units: parseFloat(units),
      price: parseFloat(price),
      type: type,
      start_time: moment(selectedStartTime, 'HH:mm').toISOString(),
      end_time: moment(selectedEndTime, 'HH:mm').toISOString(),
      BAC_increase: calculateBACIncrease(units, user.profile)  // Calculate BAC increase based on user's profile
    };

    const BACIncrease = calculateBACIncrease(units, globalData.profile);
    entry.BACIncrease = BACIncrease;

    const selectedCurrencyAmountSpent = amount * price;
    const updatedAmountSpent = { ...amountSpent, [selectedCurrency]: selectedCurrencyAmountSpent };
    setAmountSpent(updatedAmountSpent);

    // When sending data to the server
    try {
      const response = await fetch(`${getServerBaseUrl()}/api/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });

      if (!response.ok) {
        throw new Error(`AddEntry.js: HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('AddEntry.js: Entry saved successfully:', data);
      navigation.navigate('Home');
    } catch (error) {
      console.error('AddEntry.js: Error saving entry:', error);
    }
  
    navigation.navigate('Home');
  };

  const handleCheckLimits = () => {
    const { spendingLimit, drinkingLimit } = globalData.settings;

    const totalDrinks = globalData.entries.reduce((total, entry) => total + parseFloat(entry.amount), 0);
    const totalUnits = globalData.entries.reduce((total, entry) => total + parseInt(entry.units), 0);
    const totalSpending = globalData.entries.reduce((total, entry) => total + (parseFloat(entry.price) * parseFloat(entry.amount)), 0);

    setTotalDrinks(totalDrinks);
    setTotalUnits(totalUnits);
    setTotalSpending(totalSpending);

    if (totalSpending > spendingLimit) {
      sendNotification('Spending Limit Reached', 'You have exceeded your spending limit.');
    }

    if (totalDrinks > drinkingLimit) {
      sendNotification('Drinking Limit Reached', 'You have reached your drinking limit.');
    }
  };

  const validateAmount = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  const validateUnits = (value) => {
    return Number.isInteger(parseFloat(value));
  };

  const validatePrice = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  const showStartTimePicker = () => {
    setStartTimePickerVisible(true);
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisible(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisible(false);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisible(false);
  };

  const handleStartTimeConfirm = (time) => {
    setSelectedStartTime(moment(time).format('HH:mm'));
    hideStartTimePicker();
  };

  const handleEndTimeConfirm = (time) => {
    setSelectedEndTime(moment(time).format('HH:mm'));
    hideEndTimePicker();
  };

  return (
    <View style={addStyles.container}>
      <Text style={addStyles.title}>Add Entry</Text>
      <Text>Total Drinks: {totalDrinks}</Text>
      <Text>Total Units: {totalUnits}</Text>
      <Text>Total Spending: {totalSpending}</Text>
      {/* SearchDrinks component */}
      <TextInput
        style={addStyles.input}
        placeholder="Alcohol"
        value={alcohol}
        onChangeText={setAlcohol}
      />
      <TextInput
        style={addStyles.input}
        placeholder="Drink or Shot"
        value={type}
        onChangeText={setType}
      />
      <TextInput
        style={addStyles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={addStyles.input}
        placeholder="Units"
        keyboardType="numeric"
        value={units}
        onChangeText={setUnits}
      />
      <View style={addStyles.priceInputContainer}>
        <TextInput
          style={addStyles.priceInput}
          placeholder="Price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        <Picker
          selectedValue={selectedCurrency}
          style={addStyles.priceUnitPicker}
          onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
        >
          {currencies.map((currency) => (
            <Picker.Item key={currency.value} label={currency.label} value={currency.value} />
          ))}
        </Picker>
      </View>
      <Text>{`Start Time: ${selectedStartTime}`}</Text>
      <TouchableOpacity style={addStyles.button} onPress={showStartTimePicker}>
        <Text style={addStyles.buttonText}>Select Start Time</Text>
      </TouchableOpacity>
      <Text>{`End Time: ${selectedEndTime}`}</Text>
      <TouchableOpacity style={addStyles.button} onPress={showEndTimePicker}>
        <Text style={addStyles.buttonText}>Select End Time</Text>
      </TouchableOpacity>

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

      <TouchableOpacity style={addStyles.button} onPress={handleSaveEntry}>
        <Text style={addStyles.buttonText}>Save Entry</Text>
      </TouchableOpacity>

      <View style={addStyles.amountSpentContainer}>
        {currencies.map((currency) => (
          <Text key={currency.value}>
            {currency.label}: {amountSpent[currency.value] || 0}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default AddEntryScreen;

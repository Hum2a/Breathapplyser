import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import { saveDataToFile, globalData } from '../../../utils/database';
import { addStyles } from '../../styles/styles';
import { TimePickerModal } from 'react-native-paper-dates';
import { sendNotification } from '../../../utils/notifications';
import calculateBACIncrease from '../../../utils/calculations/calculateBAC';

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

  useEffect(() => {
    handleCheckLimits();
  }, [globalData.entries]);

  const handleSaveEntry = () => {
    if (!validateAmount(amount) || !validateUnits(units) || !validatePrice(price)) {
      alert('Please enter valid values for Amount, Units, and Price.');
      return;
    }
    console.log('----------ADD ENTRY LOG--------');
    const entry = {
      amount,
      alcohol,
      units,
      price,
      type,
      dateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      startTime: selectedStartTime,
      endTime: selectedEndTime,
    };
  
    console.log('Entry:', entry);
  
    const BACIncrease = calculateBACIncrease(units, globalData.profile);
    entry.BACIncrease = BACIncrease;
    console.log('BAC Increase:', BACIncrease);
  
    const selectedCurrencyAmountSpent = amount * price;
    const updatedAmountSpent = { ...amountSpent, [selectedCurrency]: selectedCurrencyAmountSpent };
    setAmountSpent(updatedAmountSpent);
    console.log('Amount Spent:', updatedAmountSpent);
  
    globalData.entries.push(entry);
    globalData.chartData.push({
      date: entry.dateTime,
      units: parseFloat(entry.units) || 0,
      BACIncrease: BACIncrease, // Add BACIncrease to the chart data
    });
  
    console.log('Updated Entries:', globalData.entries);
    globalData.globalBAC += BACIncrease;
    console.log('Updated BAC: ', globalData.globalBAC);
  
    console.log('Saving Data to File...');
    saveDataToFile();
  
    navigation.navigate('Home');
    console.log('-------------------');
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

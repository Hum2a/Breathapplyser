import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import moment from 'moment';
import { saveDataToFile, globalData } from '../../../utils/database';
import { startDrinkingStyles } from '../../styles/styles';
import { sendNotification } from '../../../utils/notifications';
import calculateBACIncrease from '../../../utils/calculations/calculateBAC';

const StartDrinkingScreen = ({ navigation }) => {
  const [alcohol, setAlcohol] = useState('');
  const [type, setType] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [units, setUnits] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [BAC, setBAC] = useState('');
  const [amountSpent, setAmountSpent] = useState({ GBP: 0 });
  
  useEffect(() => {
    // Call handleCheckLimits whenever a drinking session is finished
    handleCheckLimits();
  }, [endTime]);

  const handleStartDrinking = () => {
    const start = moment().format('YYYY-MM-DD HH:mm:ss');
    setStartTime(start);
  };

  const handleFinishDrinking = () => {
    const end = moment().format('YYYY-MM-DD HH:mm:ss');
    setEndTime(end);

    // Validate input fields before saving entry
    if (!validateInput()) {
      alert('Please enter valid values for alcohol and Type.');
      return;
    }

    const entry = {
      alcohol,
      type,
      startTime,
      endTime,
      units,
      amount,
      price,
    };

    if (globalData.entries) {
      globalData.entries.push(entry);
    } else {
      globalData.entries = [entry];
    }

    // Calculate BAC
    const BACIncrease = calculateBACIncrease(units, globalData.profile);
    entry.BACIncrease = BACIncrease;

    const selectedCurrencyAmountSpent = amount * price;
    const updatedAmountSpent = { ...amountSpent, GBP: amountSpent.GBP + selectedCurrencyAmountSpent };
    setAmountSpent(updatedAmountSpent);

    globalData.chartData.push({
      date: entry.endTime,
      units: parseFloat(entry.units) || 0,
      BACIncrease: BACIncrease, // Add BACIncrease to the chart data
    });

    globalData.globalBAC += BACIncrease;

    saveDataToFile();
    navigation.navigate('Home');
  };

  const handleCheckLimits = () => {
    const { drinkingLimit } = globalData.settings;

    // Check if drinking limit is met
    if (globalData.entries.length > drinkingLimit) {
      sendNotification('Drinking Limit Reached', 'You have reached your drinking limit.');
    }
  };

  const validateInput = () => {
    return alcohol.trim() !== '' && type.trim() !== '';
  };

  return (
    <View style={startDrinkingStyles.container}>
      <Text style={startDrinkingStyles.title}>Start Drinking</Text>
      <TextInput
        style={startDrinkingStyles.input}
        placeholder="Alcohol"
        value={alcohol}
        onChangeText={setAlcohol}
      />
      <TextInput
        style={startDrinkingStyles.input}
        placeholder="Drink or Shot"
        value={type}
        onChangeText={setType}
      />
      <TextInput
        style={startDrinkingStyles.input}
        placeholder="Units"
        keyboardType="numeric"
        value={units}
        onChangeText={setUnits}
      />
      <TextInput
        style={startDrinkingStyles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={startDrinkingStyles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      {startTime !== '' && (
        <Text style={startDrinkingStyles.timeText}>
          Start Time: {moment(startTime).format('YYYY-MM-DD HH:mm:ss')}
        </Text>
      )}
      {endTime !== '' && (
        <Text style={startDrinkingStyles.timeText}>
          End Time: {moment(endTime).format('YYYY-MM-DD HH:mm:ss')}
        </Text>
      )}
      {BAC !== '' && (
        <Text style={startDrinkingStyles.bacText}>Blood Alcohol Content (BAC): {BAC}</Text>
      )}
      <TouchableOpacity style={startDrinkingStyles.button} onPress={handleStartDrinking}>
        <Text style={startDrinkingStyles.buttonText}>Start Drinking</Text>
      </TouchableOpacity>
      {startTime !== '' && (
        <TouchableOpacity style={startDrinkingStyles.button} onPress={handleFinishDrinking}>
          <Text style={startDrinkingStyles.buttonText}>Finish Drinking</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default StartDrinkingScreen;

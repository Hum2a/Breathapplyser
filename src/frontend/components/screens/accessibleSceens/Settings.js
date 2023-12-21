import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { settingsStyles } from '../../styles/styles';
import { sendNotification } from '../../../utils/notifications';
import { saveDataToFile, loadDataFromFile } from '../../../utils/database';
import { globalData } from '../../../utils/database';

const SettingsScreen = () => {
  const [spendingLimit, setSpendingLimit] = useState(0);
  const [drinkingLimit, setDrinkingLimit] = useState(0);

  useEffect(() => {
    // Load saved limits from AsyncStorage
    loadLimits();
  }, []);
  
  useEffect(() => {
    // Save limits to AsyncStorage whenever they change
    saveLimits();
  }, [spendingLimit, drinkingLimit]);

  const loadLimits = async () => {
    try {
      const savedSpendingLimit = await AsyncStorage.getItem('spendingLimit');
      const savedDrinkingLimit = await AsyncStorage.getItem('drinkingLimit');

      if (savedSpendingLimit !== null) {
        setSpendingLimit(parseInt(savedSpendingLimit));
      }

      if (savedDrinkingLimit !== null) {
        setDrinkingLimit(parseInt(savedDrinkingLimit));
      }
    } catch (error) {
      console.log('Error loading limits:', error);
    }
  };

  const saveLimits = async () => {
    try {
      globalData.settings.spendingLimit = spendingLimit;
      globalData.settings.drinkingLimit = drinkingLimit;
      await saveDataToFile();
    } catch (error) {
      console.log('Error saving limits:', error);
    }
  };

  const handleCheckLimits = () => {
    // Check if spending limit is met
    if (totalSpending > spendingLimit) {
      sendNotification('Spending Limit Reached', 'You have exceeded your spending limit.');
    }
  
    // Check if drinking limit is met
    if (totalDrinks > drinkingLimit) {
      sendNotification('Drinking Limit Reached', 'You have reached your drinking limit.');
    }
  
    // Save the limits
    try {
      saveDataToFile();
      console.log('Limits saved successfully!');
    } catch (error) {
      console.log('Error saving limits:', error);
    }
  };
  

  // // Calculate total spending and drinks based on your app logic
  // const totalSpending = 150;
  // const totalDrinks = 5;

  const handleSaveLimits = async () => {
    try {
      await AsyncStorage.setItem('spendingLimit', spendingLimit.toString());
      await AsyncStorage.setItem('drinkingLimit', drinkingLimit.toString());
      alert('Limits saved successfully.');
    } catch (error) {
      console.log('Error saving limits:', error);
    }
  };

  return (
    <View style={settingsStyles.container}>
      <Text style={settingsStyles.label}>Spending Limit: £{spendingLimit}</Text>
      <Slider
        style={settingsStyles.slider}
        minimumValue={0}
        maximumValue={500}
        step={1}
        defaultValue={500}
        value={spendingLimit}
        onValueChange={setSpendingLimit}
      />

      <Text style={settingsStyles.label}>Drinking Limit: {drinkingLimit} units</Text>
      <Slider
        style={settingsStyles.slider}
        minimumValue={0}
        maximumValue={100}
        defaultValue={100}
        step={1}
        value={drinkingLimit}
        onValueChange={setDrinkingLimit}
      />

      {/* <TouchableOpacity style={settingsStyles.button} onPress={handleCheckLimits}>
        <Text style={settingsStyles.buttonText}>Check Limits</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={settingsStyles.button} onPress={handleSaveLimits}>
        <Text style={settingsStyles.buttonText}>Save Limits</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;

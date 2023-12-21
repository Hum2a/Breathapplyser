import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { settingsStyles } from '../../styles/styles';
import { UserContext } from '../../../context/UserContext';
import { getServerBaseUrl } from '../../../utils/config/dbURL';

const SettingsScreen = () => {
  const { user } = useContext(UserContext);
  const [spendingLimit, setSpendingLimit] = useState(0);
  const [drinkingLimit, setDrinkingLimit] = useState(0);

  useEffect(() => {
    // Load saved limits from the server or local storage
    loadLimits();
  }, [user]);

  const loadLimits = async () => {
    if (!user) {
      console.log('SettingsScreen.js: No user data available');
      return;
    }
    // Add logic to fetch limits from the server
    try {
      const apiUrl = `${getServerBaseUrl()}/api/settings/${user.id}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('SettingsScreen.js: Failed to load settings');
      }
      const data = await response.json();
      setSpendingLimit(data.spendingLimit);
      setDrinkingLimit(data.drinkingLimit);
    } catch (error) {
      console.error('SettingsScreen.js: Error loading settings:', error);
    }
  };

  const saveLimits = async () => {
    if (!user) {
      console.log('SettingsScreen.js: No user data available');
      return;
    }
    try {
      const apiUrl = `${getServerBaseUrl()}/api/settings`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id, // Assuming user has an 'id' field
          spendingLimit,
          drinkingLimit,
        }),
      });

      if (!response.ok) {
        throw new Error('SettingsScreen.js: Failed to save settings');
      }

      const data = await response.json();
      console.log('SettingsScreen.js: Settings saved successfully:', data);
    } catch (error) {
      console.error('SettingsScreen.js: Error saving settings:', error);
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
        value={spendingLimit}
        onValueChange={setSpendingLimit}
      />

      <Text style={settingsStyles.label}>Drinking Limit: {drinkingLimit} units</Text>
      <Slider
        style={settingsStyles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={drinkingLimit}
        onValueChange={setDrinkingLimit}
      />

      <TouchableOpacity style={settingsStyles.button} onPress={saveLimits}>
        <Text style={settingsStyles.buttonText}>Save Limits</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;

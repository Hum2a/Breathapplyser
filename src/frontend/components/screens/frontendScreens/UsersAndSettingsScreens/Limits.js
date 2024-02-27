import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import Slider from '@react-native-community/slider';
import { limitStyles as settingsStyles } from '../../../styles/DrinkingStyles/limitStyles';
import { appStyles } from '../../../styles/appStyles';
import { UserContext } from '../../../../context/UserContext';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

const LimitsScreen = () => {
  const { user } = useContext(UserContext);
  const [spendingLimit, setSpendingLimit] = useState(0);
  const [drinkingLimit, setDrinkingLimit] = useState(0);
  const firestore = getFirestore();

  useEffect(() => {
    // Load saved limits from the server or local storage
    loadLimits();
  }, [user]);

  const loadLimits = async () => {
    if (user) {
      const docRef = doc(firestore, user.uid, "Limits");
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const Limits = docSnap.data();
          setSpendingLimit(Limits.spendingLimit);
          setDrinkingLimit(Limits.drinkingLimit);
        }
      } catch (error) {
        console.error('Error loading Limits:', error);
      }
    }
  };

  const saveLimits = async () => {
    if (user) {
      const docRef = doc(firestore, user.uid, "Limits");
      try {
        await setDoc(docRef, { spendingLimit, drinkingLimit });
        console.log('Limits saved successfully');
      } catch (error) {
        console.error('Error saving Limits:', error);
      }
    }
  };

  return (
    <SafeAreaView style={appStyles.fullScreen}>
      <View style={settingsStyles.container}>
        <Text style={settingsStyles.title}>Limits</Text>
        <View style={settingsStyles.limitContainer}>
          <Text style={settingsStyles.label}>Spending Limit: £{spendingLimit}</Text>
          <Slider
            style={settingsStyles.slider}
            minimumValue={0}
            maximumValue={500}
            step={1}
            value={spendingLimit}
            onValueChange={setSpendingLimit}
          />
        </View>
        <View style={settingsStyles.limitContainer}>
          <Text style={settingsStyles.label}>Drinking Limit: {drinkingLimit} units</Text>
          <Slider
            style={settingsStyles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={drinkingLimit}
            onValueChange={setDrinkingLimit}
          />
        </View>
        <TouchableOpacity style={settingsStyles.button} onPress={saveLimits}>
          <Text style={settingsStyles.buttonText}>Save Limits</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LimitsScreen;

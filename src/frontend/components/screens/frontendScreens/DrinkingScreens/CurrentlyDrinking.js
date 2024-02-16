import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import moment from 'moment';
import { startDrinkingStyles } from '../../../styles/DrinkingStyles/startDrinkingStyles';
import { UserContext } from '../../../../context/UserContext';
import calculateBACIncrease from '../../../../utils/calculations/calculateBAC';
import { getFirestore, collection, setDoc, doc, query, where, getDocs, getDoc } from 'firebase/firestore';
import { AddToFavouritesButton } from '../../../buttons/AddEntryComponents/AddEntryScreenButtons';
import { addEntryToFavourites } from '../../../../../backend/app/utils/handles/addToFavourites';

const StartDrinkingScreen = ({ navigation }) => {
  const [alcohol, setAlcohol] = useState('Rum & Coke');
  const [type, setType] = useState('Mixer');
  const [startTime, setStartTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [endTime, setEndTime] = useState('');
  const [units, setUnits] = useState('2');
  const [amount, setAmount] = useState('1');
  const [price, setPrice] = useState('7.50');
  const [BAC, setBAC] = useState('');
  const [amountSpent, setAmountSpent] = useState({ GBP: 0 });
  const [userProfile, setUserProfile] = useState({});
  const firestore = getFirestore();
  const { user } = useContext(UserContext);
  
  useEffect(() => {
    // Call handleCheckLimits whenever a drinking session is finished
    handleCheckLimits();
  }, [endTime]);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const profileRef = doc(firestore, user.uid, "Profile");
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        const profileData = profileSnap.data();
        setUserProfile(profileData);
        console.log("User Profile Fetched: ", profileData); // Debug log
      } else {
        console.log("No user profile found");
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleStartDrinking = () => {
    const start = moment().format('YYYY-MM-DD HH:mm:ss');
    setStartTime(start);
  };

  const handleFinishDrinking = async () => {
    const end = moment().format('YYYY-MM-DD HH:mm:ss');
    setEndTime(end);

    if (!validateInput()) {
      alert('Please enter valid values for alcohol and Type.');
      return;
    }

    const BACIncrease = calculateBACIncrease(units, userProfile);
      // Check if BACIncrease is a valid number, and if not, set it to 0
    if (isNaN(BACIncrease) || !isFinite(BACIncrease)) {
      setBAC('0'); // Set BAC to 0 or any other appropriate default value
    } else {
      setBAC(BACIncrease.toString());
    }

    // Update total amounts for the day
    const selectedDateStr = moment().format('YYYY-MM-DD');
    const amountSpentRef = doc(firestore, user.uid, "Daily Totals", "Amount Spent", `${selectedDateStr}`);
    const unitsIntakeRef = doc(firestore, user.uid, "Daily Totals", "Unit Intake", `${selectedDateStr}`);
    const bacLevelRef = doc(firestore, user.uid, "Daily Totals", "BAC Level", `${selectedDateStr}`);

    // Fetch existing values
    const amountSpentDoc = await getDoc(amountSpentRef);
    const unitsIntakeDoc = await getDoc(unitsIntakeRef);
    const bacLevelDoc = await getDoc(bacLevelRef);

    // Update and save new values
    const newAmountSpent = (amountSpentDoc.data()?.value || 0) + (parseFloat(units) * parseFloat(price));
    const newUnitsIntake = (unitsIntakeDoc.data()?.value || 0) + parseFloat(units);
    const newBACLevel = (bacLevelDoc.data()?.value || 0) + parseFloat(BACIncrease);

    const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');

    await setDoc(amountSpentRef, {
      value: newAmountSpent,
      lastUpdated: currentDateTime,
    });
    
    await setDoc(unitsIntakeRef, {
      value: newUnitsIntake,
      lastUpdated: currentDateTime,
    });
    
    await setDoc(bacLevelRef, {
      value: newBACLevel,
      lastUpdated: currentDateTime,
    });
    

    const entry = {
      userId: user.uid,
      alcohol,
      type,
      startTime,
      endTime,
      units: parseFloat(units),
      amount: parseFloat(amount),
      price: parseFloat(price),
      BACIncrease,
      date: new Date(),
    };
    
    try {
      const dateStr = moment().format('YYYY-MM-DD'); // Get the date string
      const entryDocId = moment().format('YYYYMMDD_HHmmss');
      
      // Create an entry in "entries" collection with the new structure
      await setDoc(doc(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs", entryDocId), entry);
      alert('Drinking entry saved successfully');
    
      // Additional: Create an entry in "BAC Level" collection
      const BACLevelEntry = {
        userId: user.uid,
        currentBAC: BACIncrease, // Or calculate current BAC here if necessary
        timestamp: new Date(),
      };

      const customBACLevelDocId = `BAC_Level_${entryDocId}`;
      await setDoc(doc(firestore, user.uid, "Alcohol Stuff", "BAC Level", customBACLevelDocId), BACLevelEntry)
    
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleCheckLimits = async () => {
    if (user) {
      try {
        // Fetch user-specific settings from Firestore
        const settingsRef = doc(firestore, "settings", user.uid);
        const settingsSnap = await getDoc(settingsRef);
  
        if (settingsSnap.exists()) {
          const userSettings = settingsSnap.data();
          const userDrinkingLimit = userSettings.drinkingLimit;
  
          // Fetch the number of drinking entries for the user
          const entriesRef = collection(firestore, "drinkingEntries");
          const q = query(entriesRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const entriesCount = querySnapshot.size;
  
          if (entriesCount > userDrinkingLimit) {
            // Notify the user if the limit is exceeded
            sendNotification('Drinking Limit Reached', 'You have reached your drinking limit.');
          }
        }
      } catch (error) {
        console.error('Error checking limits:', error);
      }
    }
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
      <AddToFavouritesButton onPress={handleAddToFavourites}/>
    </View>
  );
};

export default StartDrinkingScreen;

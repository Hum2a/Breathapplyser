import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, FlatList, RefreshControl } from 'react-native';
import { getFirestore, doc, collection, getDoc, getDocs } from 'firebase/firestore';
import moment from 'moment';
import 'moment-timezone';
import calculateBACIncrease from '../../../../utils/calculations/calculateBAC';
import { saveEntry } from '../../../../../backend/firebase/queries/saveEntry';
import { saveBACLevel } from '../../../../../backend/firebase/queries/saveBACLevel';
import { UserContext } from '../../../../context/UserContext';
import { autoStyles as styles, manualStyles as addStyles } from '../../../styles/DrinkingStyles/addStyles';
import CommonDrinksList from '../../../../../backend/app/data/commonDrinksList';
import { saveDailyTotals } from '../../../../../backend/firebase/queries/saveDailyTotals';
import CommonDrinks from './CommonDrinks';
import RecentDrinks from './RecentDrinks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from 'react-native-dialog';

const AutoEntryScreen = ({ navigation }) => {
  const drinkTypes = ['Spirit', 'Beer', 'Lager', 'Wine', 'Liquers', 'Cocktails'];

  const [commonDrinks, setCommonDrinks] = useState([]);
  const [selectedDrinkType, setSelectedDrinkType] = useState(null);
  const [prices, setPrices] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [totalDrinks, setTotalDrinks] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const timezone = 'Europe/London';
  const currentBstTime = moment().tz(timezone).format('HH:mm');
  const [selectedStartTime, setSelectedStartTime] = useState(currentBstTime);
  const [selectedEndTime, setSelectedEndTime] = useState(currentBstTime);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [limits, setLimits] = useState({
    spendingLimit: 0,
    drinkingLimit: 0,
    spendingLimitStrictness: 'soft',
    drinkingLimitStrictness: 'soft'
});
  const [limitDialogVisible, setLimitDialogVisible] = useState(false);
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogAction, setDialogAction] = useState(() => () => {});
  const [refreshing, setRefreshing] = useState(false);
  
  const { user } = useContext(UserContext);
  const firestore = getFirestore();

  useEffect(() => {
      // Filter common drinks based on selected drink type
      if (selectedDrinkType) {
        const filteredDrinks = CommonDrinksList[selectedDrinkType];
        setCommonDrinks(filteredDrinks);
      }
    }, [selectedDrinkType]);

  useEffect(() => {
    fetchLimits(); // Fetch the limits when the component mounts
  }, [user]);

  const fetchCommonDrinks = async (type) => {
    const drinks = CommonDrinksList[type].map(drink => ({
      ...drink,
      fullPint: true, // Default to full pint for beers/lager
      double: false, // Default to single for spirits
      size: 'large' // Default to large for wine
    }));
    setCommonDrinks(drinks);
  };
  

  const fetchLimits = async (forceRefresh = false) => {
    if (user) {
      const cacheKey = `limits_${user.uid}`;
      try {
        if (!forceRefresh) {
          // Try to get the cached limits first
          const cachedLimits = await AsyncStorage.getItem(cacheKey);
          if (cachedLimits) {
            const limits = JSON.parse(cachedLimits);
            setLimits(limits);
            console.log('Loaded limits from cache');
            return;
          }
        }
    
        // Fetch limits from Firestore
        const docRef = doc(getFirestore(), user.uid, "Limits");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLimits({
            spendingLimit: data.spendingLimit || 0,
            drinkingLimit: data.drinkingLimit || 0,
            spendingLimitStrictness: data.spendingLimitStrictness || 'soft',
            drinkingLimitStrictness: data.drinkingLimitStrictness || 'soft',
          });
          // Cache the fetched limits
          await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
          console.log('Limits fetched from Firestore and cached');
        } else {
          console.log("No limits document found");
        }
      } catch (error) {
        console.error('Error fetching or caching limits:', error);
      }
    }
  };
    

  const handleDrinkTypeSelection = (type) => {
    if (selectedDrinkType === type) {
        // If the same type is clicked again, reset the selection
        setSelectedDrinkType(null);
        setCommonDrinks([]); // Clear the list of drinks
    } else {
        // Otherwise, update the selection and fetch the drinks
        setSelectedDrinkType(type);
        fetchCommonDrinks(type);
    }
};  

  const handleDrinkSelection = async (drink) => {
    console.log('handleDrinkSelection: Called with drink:', drink);

    const price = prices[drink.name];
    if (!price) {
      showAlertDialog('Error', 'Please enter the price.', () => {});
      return;
    }

    let units = drink.units;
    if (selectedDrinkType === 'Spirit' && drink.double) {
      units *= 2; // If it's a double, double the units
    } else if ((selectedDrinkType === 'Beer' || selectedDrinkType === 'Lager') && !drink.fullPint) {
      units *= 0.5; // If it's a half pint, halve the units
    } else if (selectedDrinkType === 'Wine') {
      if (drink.size === 'small') {
        units *= 0.5; // Assume the base units in the list are for a large measure, halve for small
      } else if (drink.size === 'medium') {
        units *= 0.7; // Adjust accordingly for medium (e.g., 70% of large)
      }
    }

    const priceToAdd = parseFloat(price); // Logic for price
    const caloriesToAdd = drink.calories; // Adding calories information

    // First, check limits before proceeding
    const canAddDrink = await handleCheckLimits(units, priceToAdd, true);
    if (!canAddDrink) {
      // If the limits are exceeded, exit the function without saving anything
      return;
    }

    // If checks pass, proceed to add the drink
    try {
      const entryData = {
        alcohol: drink.name,
        amount: 1,
        units: units,
        price: priceToAdd,
        type: selectedDrinkType,
        calories: caloriesToAdd,
        selectedStartTime: selectedStartTime,
        selectedEndTime: selectedEndTime,
        selectedDate: selectedDate,
        selectedCurrency: "GBP",
      };

      console.log('handleDrinkSelection: entryData:', entryData);

      // Save the entry in the database
      await saveEntry(user, userProfile, entryData);
      await saveBACLevel(user, entryData.units, userProfile, entryData);

      // Calculate BAC increase and update daily totals only after ensuring limits are not exceeded
      const BACIncrease = calculateBACIncrease(units, userProfile);
      const entryDetailsArray = [{
        ...entryData,
        BACIncrease
      }];

      console.log('handleDrinkSelection: entryDetailsArray:', entryDetailsArray);

      // Update daily totals
      await saveDailyTotals(firestore, user, selectedDate, entryDetailsArray);

      showAlertDialog('Success', 'Drink entry added successfully!', () => {
        navigation.navigate('Home');
      });
    } catch (error) {
      console.error('handleDrinkSelection: Error adding drink entry:', error);
      showAlertDialog('Error', 'Failed to add drink entry. Please try again.', () => {});
    }
  };

    const handlePriceChange = (drinkName, price) => {
        setPrices(prevPrices => ({
          ...prevPrices,
          [drinkName]: price,
        }));
      };

    const handleCheckLimits = async (unitsToAdd, priceToAdd, forceRefresh = false) => {
      if (forceRefresh) {
        await fetchLimits(true); // Force fetching new limits from the server
      }
      
      // Fetch the current totals for units and spending
      const currentTotals = await getCurrentTotals(selectedDate);
      const newTotalUnits = currentTotals.totalUnits + unitsToAdd;
      const newTotalSpending = currentTotals.totalSpending + priceToAdd;
    
      // Perform the limit checks
      if (limits.drinkingLimitStrictness === "hard" && newTotalUnits > limits.drinkingLimit) {
        setDialogTitle('Limit Exceeded');
        setDialogMessage('You have exceeded your hard drinking limit.');
        setLimitDialogVisible(true);
        return false;
      }
      if (limits.spendingLimitStrictness === "hard" && newTotalSpending > limits.spendingLimit) {
        setDialogTitle('Limit Exceeded');
        setDialogMessage('You have exceeded your hard spending limit.');
        setLimitDialogVisible(true);
        return false;
      }
    
      // Check soft limits using Dialog
      if (limits.drinkingLimitStrictness === "soft" && newTotalUnits > limits.drinkingLimit) {
        setDialogTitle('Soft Limit Warning');
        setDialogMessage('You are about to exceed your soft drinking limit. Proceed anyway?');
        setDialogAction(() => () => resolveProceedWithAddition(true));
        setLimitDialogVisible(true);
        return await new Promise(resolve => {
          resolveProceedWithAddition = resolve;
        });
      }

      if (limits.spendingLimitStrictness === "soft" && newTotalSpending > limits.spendingLimit) {
        setDialogTitle('Soft Limit Warning');
        setDialogMessage('You are about to exceed your soft spending limit. Proceed anyway?');
        setDialogAction(() => () => resolveProceedWithAddition(true));
        seLimitDialogVisible(true);
        return await new Promise(resolve => {
          resolveProceedWithAddition = resolve;
        });
      }

      return true;
    };
      
    const getCurrentTotals = async (selectedDate) => {
      console.log('getCurrentTotals called with selectedDate:', selectedDate);
      const dateStr = moment(selectedDate).format('YYYY-MM-DD');
      const unitsRef = doc(firestore, user.uid, "Daily Totals", "Unit Intake", dateStr);
      const spendingRef = doc(firestore, user.uid, "Daily Totals", "Amount Spent", dateStr);

      const unitsSnap = await getDoc(unitsRef);
      const spendingSnap = await getDoc(spendingRef);

      const totals = {
          totalUnits: unitsSnap.exists() ? unitsSnap.data().value : 0,
          totalSpending: spendingSnap.exists() ? spendingSnap.data().value : 0,
      };

      console.log('currentTotals:', totals);
      return totals;
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

  const handleToggleDrinkSize = (drink, size) => {
    const updatedDrinks = commonDrinks.map((item) => {
      if (item.name === drink.name) {
        // Toggle the size between single/double for spirits, full/half pint for beer/lager, or small/medium/large for wine
        if (selectedDrinkType === 'Spirit') {
          return { ...item, double: !item.double };
        } else if (selectedDrinkType === 'Beer' || selectedDrinkType === 'Lager') {
          return { ...item, fullPint: !item.fullPint };
        } else if (selectedDrinkType === 'Wine') {
          return { ...item, size }; // size can be 'small', 'medium', or 'large'
        }
      }
      return item;
    });
    setCommonDrinks(updatedDrinks);
  };  

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchLimits(true); // Refresh your limits
      // You can also call any other data fetching functions here
      console.log("Data refreshed!");
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }
    setRefreshing(false);
  };

  const showAlertDialog = (title, message, onDismiss) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogAction(() => onDismiss);
    setAddDialogVisible(true);
}
  
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {drinkTypes.map((type, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, selectedDrinkType === type && styles.selectedButton]}
            onPress={() => handleDrinkTypeSelection(type)}
          >
            <Text style={[styles.buttonText, selectedDrinkType === type && styles.selectedButtonText]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedDrinkType === null ? (
        <View style={styles.drinkTypeContainer}>
          <CommonDrinks />
          <RecentDrinks />
        </View>
      ) : (
        <FlatList
        data={commonDrinks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={() => handleDrinkSelection(item)}
              style={styles.drinkContainer}
            >
              <Text style={styles.drinkNameText}>{item.name}</Text>
              <Text style={styles.drinkText}>Type: {item.alcohol}</Text>
              <Text style={styles.drinkText}>Units: {item.units}</Text>
              <Text style={styles.drinkText}>Calories: {item.calories}</Text>
              <View style={styles.backgroundTextContainer}>
                <Text style={styles.backgroundText}>
                  Click Here
                </Text>
            </View>
              {selectedDrinkType === 'Spirit' && (
                <View style={styles.doubleToggleContainer}>
                  <TouchableOpacity
                    style={[styles.doubleToggle, !item.double && styles.doubleToggleActive]}
                    onPress={() => handleToggleDrinkSize(item)}
                  >
                    <Text style={[styles.doubleToggleText, !item.double && styles.doubleToggleTextActive]}>Single</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.doubleToggle, item.double && styles.doubleToggleActive]}
                    onPress={() => handleToggleDrinkSize(item)}
                  >
                    <Text style={[styles.doubleToggleText, item.double && styles.doubleToggleTextActive]}>Double</Text>
                  </TouchableOpacity>
                </View>
              )}

              {(selectedDrinkType === 'Beer' || selectedDrinkType === 'Lager') && (
                <View style={styles.doubleToggleContainer}>
                  <TouchableOpacity
                    style={[styles.doubleToggle, !item.fullPint && styles.doubleToggleActive]}
                    onPress={() => handleToggleDrinkSize(item)}
                  >
                    <Text style={[styles.doubleToggleText, !item.fullPint && styles.doubleToggleTextActive]}>Half Pint</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.doubleToggle, item.fullPint && styles.doubleToggleActive]}
                    onPress={() => handleToggleDrinkSize(item)}
                  >
                    <Text style={[styles.doubleToggleText, item.fullPint && styles.doubleToggleTextActive]}>Full Pint</Text>
                  </TouchableOpacity>
                </View>
              )}

              {selectedDrinkType === 'Wine' && (
                <View style={styles.wineToggleContainer}>
                  <TouchableOpacity
                    style={[styles.wineToggle, item.size === 'small' && styles.wineToggleActive]}
                    onPress={() => handleToggleDrinkSize(item, 'small')}
                  >
                    <Text style={[styles.wineToggleText, item.size === 'small' && styles.wineToggleTextActive]}>Small (125ml)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.wineToggle, item.size === 'medium' && styles.wineToggleActive]}
                    onPress={() => handleToggleDrinkSize(item, 'medium')}
                  >
                    <Text style={[styles.wineToggleText, item.size === 'medium' && styles.wineToggleTextActive]}>Medium (175ml)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.wineToggle, item.size === 'large' && styles.wineToggleActive]}
                    onPress={() => handleToggleDrinkSize(item, 'large')}
                  >
                    <Text style={[styles.wineToggleText, item.size === 'large' && styles.wineToggleTextActive]}>Large (250ml)</Text>
                  </TouchableOpacity>
                </View>
              )}

            </TouchableOpacity>
            <TextInput
              placeholder="Enter price"
              placeholderTextColor={'black'}
              keyboardType="numeric"
              value={prices[item.name]}
              onChangeText={(text) => handlePriceChange(item.name, text)}
              style={styles.priceInput}
            />
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#9Bd35A", "#689F38"]} // Optional: customize the colors of the spinner
          />
        }
      />      
    )}
      <Dialog.Container
        visible={limitDialogVisible}
        contentStyle={styles.dialogContainer}
      >
        <Dialog.Title style={styles.dialogTitle}>{dialogTitle}</Dialog.Title>
        <Dialog.Description style={styles.dialogDescription}>
          {dialogMessage}
        </Dialog.Description>
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setLimitDialogVisible(false);
            resolveProceedWithAddition(false); // this function should be defined to handle the promise resolution
          }}
          style={[styles.dialogButton, styles.dialogButtonCancel]} // specific style for cancel button
          textStyle={styles.dialogButtonText}
        />
        <Dialog.Button
          label="OK"
          onPress={() => {
            setLimitDialogVisible(false);
            dialogAction(); // make sure this function appropriately handles what happens after OK is pressed
          }}
          style={styles.dialogButton}
          textStyle={styles.dialogButtonText}
        />
      </Dialog.Container>

      <Dialog.Container 
        visible={addDialogVisible}
        contentStyle={styles.dialogContainer}
          >
        <Dialog.Title style={styles.dialogTitle}>{dialogTitle}</Dialog.Title>
        <Dialog.Description style={styles.dialogDescription}>
          {dialogMessage}
        </Dialog.Description>
        <Dialog.Button 
          label="OK" 
          onPress={() => {
          setAddDialogVisible(false);
          dialogAction(); // This will handle navigation or any cleanup
        }} 
          style={styles.dialogButton}
          textStyle={styles.dialogButtonText}
          />
      </Dialog.Container>
    </View>
  );
};

export default AutoEntryScreen;

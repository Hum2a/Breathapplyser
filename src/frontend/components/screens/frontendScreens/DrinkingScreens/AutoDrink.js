import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, FlatList } from 'react-native';
import { getFirestore, doc, collection, getDoc, getDocs } from 'firebase/firestore';
import moment from 'moment';
import calculateBACIncrease from '../../../../utils/calculations/calculateBAC';
import { saveEntry } from '../../../../../backend/firebase/queries/saveEntry';
import { saveBACLevel } from '../../../../../backend/firebase/queries/saveBACLevel';
import { UserContext } from '../../../../context/UserContext';
import { autoStyles as styles, manualStyles as addStyles } from '../../../styles/DrinkingStyles/addStyles';
import CommonDrinksList from '../../../../../backend/app/data/commonDrinksList';
import { saveDailyTotals } from '../../../../../backend/firebase/queries/saveDailyTotals';
import CommonDrinks from './CommonDrinks';
import RecentDrinks from './RecentDrinks';

const AutoEntryScreen = ({ navigation }) => {
    const drinkTypes = ['Spirit', 'Beer', 'Lager', 'Wine', 'Liquers', 'Cocktails'];
  
    const [commonDrinks, setCommonDrinks] = useState([]);
    const [selectedDrinkType, setSelectedDrinkType] = useState(null);
    const [prices, setPrices] = useState({});
    const [userProfile, setUserProfile] = useState(null);
    const [totalDrinks, setTotalDrinks] = useState(0);
    const [totalUnits, setTotalUnits] = useState(0);
    const [totalSpending, setTotalSpending] = useState(0);
    const [selectedStartTime, setSelectedStartTime] = useState(moment().format('HH:mm'));
    const [selectedEndTime, setSelectedEndTime] = useState(moment().format('HH:mm'));
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [limits, setLimits] = useState({
      spendingLimit: 0,
      drinkingLimit: 0,
      spendingLimitStrictness: 'soft',
      drinkingLimitStrictness: 'soft'
  });
    
    const { user } = useContext(UserContext);
    const firestore = getFirestore();;

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
    // You can fetch common drinks for each type from your database
    // For now, we'll just use a static array
    const drinks = CommonDrinksList[type];
    setCommonDrinks(drinks);
    };

    const fetchLimits = async () => {
      if (user) {
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

      const unitsToAdd = drink.units; // Your logic for units
      const priceToAdd = parseFloat(prices[drink.name]); // Your logic for price

      const canAddDrink = await handleCheckLimits(unitsToAdd, priceToAdd);
      if (!canAddDrink) return; // Stop if limits are exceeded

      const price = prices[drink.name];
      
      if (!price) {
          Alert.alert('Error', 'Please enter the price.');
          return;
      }
      
      try {
          let units = drink.units;
          if (selectedDrinkType === 'Spirit') {
              // If it's a double, double the units
              units = drink.double ? drink.units * 2 : drink.units;
          }
          
          const entryData = {
              alcohol: drink.name, // Assuming drink.name contains the name of the drink
              amount: 1,
              units: units,
              price: parseFloat(price),
              type: selectedDrinkType, // Use the selectedDrinkType for the drink type
              selectedStartTime: moment(selectedStartTime, 'HH:mm').toISOString(),
              selectedEndTime: moment(selectedEndTime, 'HH:mm').toISOString(),
              selectedDate: selectedDate,
              selectedCurrency: "GBP",
          };
      
          await saveEntry(user, userProfile, entryData);
          await saveBACLevel(user, entryData.units, userProfile, entryData);
          
          // Assuming BACIncrease needs to be calculated for daily totals
          const BACIncrease = calculateBACIncrease(units, userProfile);
          
          // Prepare the entry details array for the daily totals
          const entryDetailsArray = [{
              ...entryData,
              BACIncrease, // Add BACIncrease to the entry details if necessary for daily totals
          }];
          
          // Update daily totals
          await saveDailyTotals(firestore, user, selectedDate, entryDetailsArray);
          
          Alert.alert('Success', 'Drink entry added successfully!');
          navigation.navigate('Home');
      } catch (error) {
          console.error('Error adding drink entry:', error);
          Alert.alert('Error', 'Failed to add drink entry. Please try again.');
      }
  };
    

    const handlePriceChange = (drinkName, price) => {
        setPrices(prevPrices => ({
          ...prevPrices,
          [drinkName]: price,
        }));
      };

      const handleCheckLimits = async (unitsToAdd, priceToAdd) => {
        // Fetch the current totals for units and spending
        const currentTotals = await getCurrentTotals(selectedDate);

        const newTotalUnits = currentTotals.totalUnits + unitsToAdd;
        const newTotalSpending = currentTotals.totalSpending + priceToAdd;

        // Check hard limits first
        if (limits.drinkingLimitStrictness === "hard" && newTotalUnits > limits.drinkingLimit) {
            Alert.alert('Limit Exceeded', 'You have exceeded your hard drinking limit.');
            return false;
        }
        if (limits.spendingLimitStrictness === "hard" && newTotalSpending > limits.spendingLimit) {
            Alert.alert('Limit Exceeded', 'You have exceeded your hard spending limit.');
            return false;
        }

        // Check soft limits
        let proceedWithAddition = true;
        if (limits.drinkingLimitStrictness=== "soft" && newTotalUnits > limits.drinkingLimit) {
            proceedWithAddition = await new Promise(resolve => Alert.alert(
                'Soft Limit Warning', 
                'You are about to exceed your soft drinking limit. Proceed anyway?', 
                [
                    { text: 'Cancel', onPress: () => resolve(false) },
                    { text: 'Proceed', onPress: () => resolve(true) }
                ]
            ));
        }

        if (!proceedWithAddition) return false;

        if (limits.spendingLimitStrictness === "soft" && newTotalSpending > limits.spendingLimit) {
            proceedWithAddition = await new Promise(resolve => Alert.alert(
                'Soft Limit Warning', 
                'You are about to exceed your soft spending limit. Proceed anyway?', 
                [
                    { text: 'Cancel', onPress: () => resolve(false) },
                    { text: 'Proceed', onPress: () => resolve(true) }
                ]
            ));
        }

        return proceedWithAddition;
    };
    const getCurrentTotals = async (selectedDate) => {

      const dateStr = moment(selectedDate).format('YYYY-MM-DD');
      const unitsRef = doc(firestore, user.uid, "Daily Totals", "Unit Intake", dateStr);
      const spendingRef = doc(firestore, user.uid, "Daily Totals", "Amount Spent", dateStr);

      const unitsSnap = await getDoc(unitsRef);
      const spendingSnap = await getDoc(spendingRef);

      return {
          totalUnits: unitsSnap.exists() ? unitsSnap.data().value : 0,
          totalSpending: spendingSnap.exists() ? spendingSnap.data().value : 0,
      };
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

  const handleToggleDouble = (drink) => {
    const updatedDrinks = commonDrinks.map((item) =>
      item.name === drink.name ? { ...item, double: !item.double } : item
    );
    setCommonDrinks(updatedDrinks);
  };
  

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Common Drinks</Text> */}
      <View style={addStyles.statsContainer}>
          <Text style={addStyles.statText}>Total Drinks: {totalDrinks}</Text>
          <Text style={addStyles.statText}>Units: {totalUnits}</Text>
          <Text style={addStyles.statText}>Spending: £{totalSpending}</Text>
        </View>
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
      <FlatList
        data={commonDrinks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={() => handleDrinkSelection(item)}
              style={styles.drinkContainer}
            >
              <Text style={styles.drinkText}>{item.name}</Text>
              <Text style={styles.drinkText}>Alcohol: {item.alcohol}</Text>
              <Text style={styles.drinkText}>Units: {item.units}</Text>
              {selectedDrinkType === 'Spirit' && (
                <View style={styles.doubleToggleContainer}>
                <TouchableOpacity
                  style={[styles.doubleToggle, !item.double && styles.doubleToggleActive]}
                  onPress={() => handleToggleDouble(item)}
                >
                  <Text style={[styles.doubleToggleText, !item.double && styles.doubleToggleTextActive]}>Single</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.doubleToggle, item.double && styles.doubleToggleActive]}
                  onPress={() => handleToggleDouble(item)}
                >
                  <Text style={[styles.doubleToggleText, item.double && styles.doubleToggleTextActive]}>Double</Text>
                </TouchableOpacity>
              </View>              
              )}
            </TouchableOpacity>
            <TextInput
              placeholder="Enter price"
              keyboardType="numeric"
              value={prices[item.name]}
              onChangeText={(text) => handlePriceChange(item.name, text)}
              style={styles.priceInput}
            />
          </View>
        )}
      />
    </View>
  );
};

export default AutoEntryScreen;


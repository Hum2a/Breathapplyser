import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, FlatList } from 'react-native';
import { getFirestore, doc, collection, getDoc, getDocs } from 'firebase/firestore';
import moment from 'moment';
import calculateBACIncrease from '../../../../utils/calculations/calculateBAC';
import { saveEntry } from '../../../../../backend/firebase/queries/saveEntry';
import { saveBACLevel } from '../../../../../backend/firebase/queries/saveBACLevel';
import { UserContext } from '../../../../context/UserContext';
import { autoStyles as styles } from '../../../styles/DrinkingStyles/addStyles';
import CommonDrinksList from '../../../../../backend/app/data/commonDrinksList';
import { saveDailyTotals } from '../../../../../backend/firebase/queries/saveDailyTotals';

const AutoEntryScreen = () => {
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
    
    const { user } = useContext(UserContext);
    const firestore = getFirestore();;

    useEffect(() => {
        // Filter common drinks based on selected drink type
        if (selectedDrinkType) {
          const filteredDrinks = CommonDrinksList[selectedDrinkType];
          setCommonDrinks(filteredDrinks);
        }
      }, [selectedDrinkType]);

    const fetchCommonDrinks = async (type) => {
    // You can fetch common drinks for each type from your database
    // For now, we'll just use a static array
    const drinks = CommonDrinksList[type];
    setCommonDrinks(drinks);
    };

    const handleDrinkTypeSelection = (type) => {
        setSelectedDrinkType(type);
        fetchCommonDrinks(type);
      };

      const handleDrinkSelection = async (drink) => {
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
                selectedDate: moment(selectedDate).toISOString(),
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

  const handleToggleDouble = (drink) => {
    const updatedDrinks = commonDrinks.map((item) =>
      item.name === drink.name ? { ...item, double: !item.double } : item
    );
    setCommonDrinks(updatedDrinks);
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Common Drinks</Text>
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


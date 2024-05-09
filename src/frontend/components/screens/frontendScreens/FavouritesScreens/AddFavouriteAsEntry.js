import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView, Dimensions, Image, SafeAreaView } from 'react-native';
import { favouriteStyles, dialogStyles } from '../../../styles/FavouriteStyles/favouriteStyles';
import { getFirestore, collection, getDocs, doc, deleteDoc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import calculateBACIncrease from '../../../../utils/calculations/calculateBAC'; // Import the calculateBACIncrease function
import Svg, { Polygon } from 'react-native-svg';
import Dialog from 'react-native-dialog';
import LinearGradient from 'react-native-linear-gradient';
import { saveEntry } from '../../../../../backend/firebase/queries/saveEntry';
import { saveBACLevel } from '../../../../../backend/firebase/queries/saveBACLevel';
import { saveDailyTotals } from '../../../../../backend/firebase/queries/saveDailyTotals';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavouriteList = ({ user, navigation }) => {
  const [Favourites, setFavourites] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedFavouriteId, setSelectedFavouriteId] = useState(null);
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [addVenueDialogVisible, setAddVenueDialogVisible] = useState(false);
  const [newVenueName, setNewVenueName] = useState('');
  const [date, setDate] = useState(new Date());
  const [limits, setLimits] = useState({
    spendingLimit: 0,
    drinkingLimit: 0,
    spendingLimitStrictness: 'soft',
    drinkingLimitStrictness: 'soft'
  });
  const firestore = getFirestore();

  const fetchFavourites = async (ignoreCache = false) => {
    if (!selectedVenue) return;
  
    const cacheKey = `favourites_${user.uid}_${selectedVenue}`;
    if (!ignoreCache) {
      const cachedData = await getCachedData(cacheKey);
      if (cachedData) {
        setFavourites(cachedData);
        return;
      }
    }
  
    try {
      const querySnapshot = await getDocs(collection(firestore, user.uid, 'Alcohol Stuff', "Venues", selectedVenue, "Favourites"));
      const FavouritesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavourites(FavouritesData);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(FavouritesData));
    } catch (error) {
      console.error('Error fetching Favourites:', error);
    }
  };

  const fetchVenues = async () => {
    try {
      const venueSnapshot = await getDocs(collection(firestore, user.uid, 'Alcohol Stuff', "Venues"));
      const venuesData = venueSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVenues(venuesData);
      if (venuesData.length > 0) {
        setSelectedVenue(venuesData[0].id);  // Automatically select the first venue
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

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
        } else {
          console.log("No such profile document!");
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    }
  };    

  useEffect(() => {
    if (user) {
      fetchVenues();
      fetchUserProfile();
    } else {
      console.error('User is not authenticated.');
    }
  }, [user]);

  useEffect(() => {
    fetchFavourites();
  }, [selectedVenue]);

  useEffect(() => {
    if (user) {
      fetchLimits(); // Call fetchLimits when the component mounts
    }
  }, [user]);

  const fetchLimits = async () => {
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
  };

  const getCachedData = async (key) => {
    try {
      const jsonString = await AsyncStorage.getItem(key);
      return jsonString != null ? JSON.parse(jsonString) : null;
    } catch (error) {
      console.error('Error retrieving data from cache:', error);
      return null;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedFavouriteId || !selectedVenue) {
      Alert.alert('Error', 'Invalid venue or favourite ID.');
      setDialogVisible(false);
      return;
    }
  
    try {
      const favouriteDocRef = doc(firestore, user.uid, "Alcohol Stuff", "Venues", selectedVenue, "Favourites", selectedFavouriteId);
      await deleteDoc(favouriteDocRef);
      setFavourites(prevFavourites => prevFavourites.filter(favourite => favourite.id !== selectedFavouriteId));
      Alert.alert('Deleted', 'The favourite has been successfully deleted.');
    } catch (error) {
      console.error('Error deleting favourite:', error);
      Alert.alert('Error', 'Could not delete favourite.');
    }
    setDialogVisible(false);
    setSelectedFavouriteId(null);
  };

  const showDeleteDialog = (FavouriteId) => {
    setSelectedFavouriteId(FavouriteId);
    setDialogVisible(true);
  };

  const handleAddFavoriteAsEntry = async (favourite) => {
    // Before adding the entry, check if it would exceed the user's limits
    const canAdd = await checkLimits(favourite.Units, favourite.Price);
    if (!canAdd) return; // Stop the function if the limits would be exceeded
  
    try {
      const entryDetails = {
        alcohol: favourite.Alcohol,
        amount: favourite.Amount,
        units: favourite.Units,
        price: favourite.Price,
        type: favourite.Type,
        calories: favourite.Calories,
        selectedStartTime: favourite.StartTime || moment().format('HH:mm'),
        selectedEndTime: favourite.EndTime || moment().format('HH:mm'),
        selectedDate: date,
        selectedCurrency: favourite.Currency || 'GBP', // Use a default currency if not specified
      };
  
      await saveEntry(user, userProfile, entryDetails);
      await saveDailyTotals(firestore, user, entryDetails.selectedDate, [entryDetails]);
      await saveBACLevel(user, favourite.Units, userProfile, entryDetails);
  
      Alert.alert('Success', 'Favourite entry added successfully.');
      navigation.goBack(); // Adjust as needed for navigation
    } catch (error) {
      console.error('Error adding favourite as entry:', error);
      Alert.alert('Error', 'Could not add the favourite as an entry.');
    }
  };
  const checkLimits = async (unitsToAdd, priceToAdd) => {
    // Assume getCurrentTotals() is implemented to fetch the current total units and spending
    const currentTotals = await getCurrentTotals(); 
    const newTotalUnits = currentTotals.totalUnits + unitsToAdd;
    const newTotalSpending = currentTotals.totalSpending + priceToAdd;
  
    if (limits.drinkingLimitStrictness === 'hard' && newTotalUnits > limits.drinkingLimit) {
      Alert.alert('Limit Reached', 'You have exceeded your hard drinking limit.');
      return false;
    }
  
    if (limits.spendingLimitStrictness === 'hard' && newTotalSpending > limits.spendingLimit) {
      Alert.alert('Limit Reached', 'You have exceeded your hard spending limit.');
      return false;
    }
  
    if (limits.drinkingLimitStrictness === 'soft' && newTotalUnits > limits.drinkingLimit) {
      Alert.alert('Warning', 'You are approaching your soft drinking limit.');
    }
  
    if (limits.spendingLimitStrictness === 'soft' && newTotalSpending > limits.spendingLimit) {
      Alert.alert('Warning', 'You are approaching your soft spending limit.');
    }
  
    return true; // Allow adding the drink if no hard limits are exceeded
  };

  const getCurrentTotals = async () => {
    const selectedDateStr = moment().format('YYYY-MM-DD'); // Use current date
  
    let totalUnits = 0;
    let totalSpending = 0;
  
    // Reference to the document storing today's total units and spending
    const unitsIntakeRef = doc(firestore, user.uid, "Daily Totals", "Unit Intake", selectedDateStr);
    const spendingRef = doc(firestore, user.uid, "Daily Totals", "Amount Spent", selectedDateStr);
  
    try {
      // Fetch total units
      const unitsSnapshot = await getDoc(unitsIntakeRef);
      if (unitsSnapshot.exists()) {
        totalUnits = unitsSnapshot.data().value; // Assuming the field storing units is named 'value'
      }
  
      // Fetch total spending
      const spendingSnapshot = await getDoc(spendingRef);
      if (spendingSnapshot.exists()) {
        totalSpending = spendingSnapshot.data().value; // Assuming the field storing spending is named 'value'
      }
    } catch (error) {
      console.error("Error fetching current totals:", error);
    }
  
    return { totalUnits, totalSpending };
  };

  const renderSquareItem = ({ item, navigation }) => (
    <TouchableOpacity
      style={favouriteStyles.favouriteItem}
      onPress={() => handleAddFavoriteAsEntry(item)}
    >
      <LinearGradient
        colors={['#92DDFE', '#BAEAFF']} // Start and end colors
        style={favouriteStyles.gradient}>
        <View>
          <View style={favouriteStyles.infoContainer}>
            <Text style={favouriteStyles.categoryText}>Drink: </Text>
            <Text style={favouriteStyles.detailsText}>{item.Alcohol}</Text>
          </View>

          <View style={favouriteStyles.infoContainer}>
            <Text style={favouriteStyles.categoryText}>Amount: </Text>
            <Text style={favouriteStyles.detailsText}>{item.Amount}</Text>
          </View>

          <View style={favouriteStyles.infoContainer}>
            <Text style={favouriteStyles.categoryText}>Price: </Text>
            <Text style={favouriteStyles.detailsText}>{item.Price}</Text>
          </View>

          <View style={favouriteStyles.infoContainer}>
            <Text style={favouriteStyles.categoryText}>Type: </Text>
            <Text style={favouriteStyles.detailsText}>{item.Type}</Text>
          </View>

          <View style={favouriteStyles.infoContainer}>
            <Text style={favouriteStyles.categoryText}>Units: </Text>
            <Text style={favouriteStyles.detailsText}>{item.Units}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={favouriteStyles.deleteButton}
          onPress={() => showDeleteDialog(item.id)}
        >
          {/* <Text style={favouriteStyles.deleteButtonText}>Delete</Text> */}
          <Image
            source={require('../../../../assets/images/bin.png')}
            style={favouriteStyles.binIcon}
            />
        </TouchableOpacity>
        <View style={favouriteStyles.backgroundTextContainer}>
          <Text style={favouriteStyles.backgroundText}>
            {selectedVenue}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const addVenue = async () => {
    if (newVenueName.trim() === '') {
      Alert.alert('Validation', 'Please enter a valid venue name.');
      return;
    }
    try {
      const newVenueRef = doc(firestore, user.uid, 'Alcohol Stuff', "Venues", `${newVenueName}`);
      await setDoc(newVenueRef, { name: newVenueName });
      fetchVenues();  // Refresh the venues list
      setNewVenueName(''); // Reset the input field
      toggleAddVenueDialog(); // Close the dialog
    } catch (error) {
      console.error('Error adding new venue:', error);
      Alert.alert('Error', 'Could not add new venue.');
    }
  };
  

  const toggleAddVenueDialog = () => {
    setAddVenueDialogVisible(!addVenueDialogVisible);
  };
  
  // const renderItem = ({ item }) => (
  //   <TouchableOpacity 
  //     onPress={() => handleAddFavoriteAsEntry(item)}
  //     style={ favouriteStyles.flatlistContainer }>
  //     <View style={ favouriteStyles.starView }>
  //       <Svg height='350' width='350' viewBox="0 0 100 100">
  //         <Polygon
  //           points="50,0 61,35 98,35 67,57 76,91 50,70 24,91 33,57 2,35 39,35"
  //           fill="#65C5F9" // Light blue fill color for the star
  //           stroke="#003366" // Dark blue for the border color to contrast with the fill
  //           strokeWidth="1" // Thickness of the border
  //         />
  //       </Svg>
  //       <View style={[favouriteStyles.starContent, { position: 'absolute', top: '34%', left: '10%', right: '10%' }]}>
  //         <Text style={favouriteStyles.categoryText}>{item.Alcohol}</Text>
  //         <Text style={favouriteStyles.detailsText}>Amount: {item.Amount}</Text>
  //         <Text style={favouriteStyles.detailsText}>Price: {item.Price}</Text>
  //         <Text style={favouriteStyles.detailsText}>Type: {item.Type}</Text>
  //         <Text style={favouriteStyles.detailsText}>Units: {item.Units}</Text>
  //         <TouchableOpacity
  //           style={favouriteStyles.deleteButton}
  //           onPress={() => showDeleteDialog(item.id)}
  //         >

  //           <Image
  //             source={require('../../../../assets/images/bin.png')}
  //             style={favouriteStyles.binIcon}
  //             />
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   </TouchableOpacity>
  // );


  return (
    <View style={favouriteStyles.fullscreen}>
      <View style={favouriteStyles.venueContainer}>
        <TouchableOpacity style={favouriteStyles.venueButton} onPress={toggleAddVenueDialog}>
          <Text style={favouriteStyles.venueButtonText}>
            Add New Venue
          </Text>
        </TouchableOpacity>
        <View style={favouriteStyles.pickerContainer}>
          <Picker
            selectedValue={selectedVenue}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedVenue(itemValue);
              refreshFavourites();
            }}
            mode='dropdown'
            style={favouriteStyles.picker}>
            {venues.map((venue) => (
              <Picker.Item key={venue.id} label={venue.name} value={venue.id} />
            ))}
          </Picker>
        </View>
      </View>
      <FlatList
          data={Favourites}
          renderItem={({ item }) => renderSquareItem({ item, navigation })}
          keyExtractor={(item) => item.id}
        />

      <Dialog.Container 
        visible={dialogVisible} 
        contentStyle={{
          backgroundColor: 'black', // Light Blue background; solid color as gradient is not directly supported
          borderRadius: 10,
        }}
        >
        <Dialog.Title style={dialogStyles.title}>Delete Favourite</Dialog.Title>
        <Dialog.Description style={dialogStyles.description}>
          Are you sure you want to delete this favourite?
        </Dialog.Description>
        <Dialog.Button
          label="Cancel"
          onPress={() => setDialogVisible(false)}
          style={[dialogStyles.buttonLabel, dialogStyles.cancelButton]}
        />
        <Dialog.Button
          label="Delete"
          onPress={handleConfirmDelete}
          style={[dialogStyles.buttonLabel, dialogStyles.deleteButton]}
        />
      </Dialog.Container>

      <Dialog.Container 
        visible={addVenueDialogVisible} 
        contentStyle={{
          backgroundColor: 'black',
          borderRadius: 10,
        }}>
        <Dialog.Title style={dialogStyles.title}>Add New Venue</Dialog.Title>
        <Dialog.Input 
          placeholder="Enter venue name"
          value={newVenueName}
          onChangeText={setNewVenueName}
          style={dialogStyles.input} // Make sure to define this style in your stylesheets
        />
        <Dialog.Button style={[dialogStyles.buttonLabel, dialogStyles.cancelButton]} label="Cancel" onPress={toggleAddVenueDialog} />
        <Dialog.Button style={[dialogStyles.buttonLabel, dialogStyles.addButton]} label="Add" onPress={addVenue} />
      </Dialog.Container>

      <TouchableOpacity onPress={() => fetchFavourites(true)} style={favouriteStyles.refreshButton}>
          <Image
              source={require('../../../../assets/images/refresh-icon.png')}
              style={favouriteStyles.updateButtonImage} 
          />
      </TouchableOpacity>
      </View>
  );
};

export default FavouriteList;

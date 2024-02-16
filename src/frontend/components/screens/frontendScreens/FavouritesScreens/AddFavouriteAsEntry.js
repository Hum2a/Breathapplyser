import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { favouriteStyles } from '../../../styles/FavouriteStyles/favouriteStyles';
import { getFirestore, collection, getDocs, doc, deleteDoc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import moment from 'moment';
import calculateBACIncrease from '../../../../utils/calculations/calculateBAC'; // Import the calculateBACIncrease function

const FavouriteList = ({ user, navigation }) => {
  const [Favourites, setFavourites] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const firestore = getFirestore();

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, user.uid, "Alcohol Stuff", "Favourites"));
        const FavouritesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFavourites(FavouritesData);
      } catch (error) {
        console.error('Error fetching Favourites:', error);
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

    if (user) {
      fetchFavourites();
      fetchUserProfile();
    } else {
      console.error('User is not authenticated.');
    }
  }, [user]);

  const handleDeleteFavourite = async (FavouriteId) => {
    try {
      await deleteDoc(doc(firestore, user.uid, "Alcohol Stuff", "Favourites", FavouriteId));
      setFavourites(Favourites.filter(favourite => favourite.id !== FavouriteId));
    } catch (error) {
      console.error('Error deleting favourite:', error);
      Alert.alert('Error', 'Could not delete favourite.');
    }
  };

  const handleAddFavoriteAsEntry = async (favourite) => {
    try {

      const BACIncrease = userProfile ? calculateBACIncrease(favourite.Units, userProfile) : 0;

        // Convert price and units to numbers
      const priceAsNumber = parseFloat(favourite.Price) || 0; // using parseFloat to handle decimals
      const unitsAsNumber = parseFloat(favourite.Units) || 0; // using parseFloat to handle decimals

      // Create a new entry using the favorite data
      const entryData = {
        date: Timestamp.fromDate(new Date()), // Using Timestamp for Firestore
        alcohol: favourite.Alcohol || "Default Alcohol",
        amount: 1,
        BACIncrease: BACIncrease,
        endTime: favourite.EndTime || moment().format('YYYY-MM-DD HH:mm:ss'), // If endTime is a property of favourite
        price: priceAsNumber || 0,
        startTime: favourite.StartTime || moment().format('YYYY-MM-DD HH:mm:ss'), // Use favourite startTime or current time
        type: favourite.Type || "Default Type",
        units: unitsAsNumber || 0,
        userId: user.uid,
      };
  
      // Add the new entry to the Firestore collection
      const dateTimeString = moment().format('YYYYMMDD_HHmmss');
      const dateStr = moment().format('YYYY-MM-DD');
      const entryDocId = `${dateTimeString}`;
      await setDoc(doc(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs", entryDocId), entryData);

      // Define references for daily totals
      const selectedDateStr = moment().format('YYYY-MM-DD');
      const amountSpentRef = doc(firestore, user.uid, "Daily Totals", "Amount Spent", selectedDateStr);
      const unitsIntakeRef = doc(firestore, user.uid, "Daily Totals", "Unit Intake", selectedDateStr);
      const bacLevelRef = doc(firestore, user.uid, "Daily Totals", "BAC Level", selectedDateStr);

      // Fetch existing daily totals
      const amountSpentDoc = await getDoc(amountSpentRef);
      const unitsIntakeDoc = await getDoc(unitsIntakeRef);
      const bacLevelDoc = await getDoc(bacLevelRef);

      // Calculate new totals
      const newAmountSpent = (amountSpentDoc.exists() ? amountSpentDoc.data().value : 0) + priceAsNumber;
      const newUnitsIntake = (unitsIntakeDoc.exists() ? unitsIntakeDoc.data().value : 0) + unitsAsNumber;
      const newBACLevel = (bacLevelDoc.exists() ? bacLevelDoc.data().value : 0) + BACIncrease;

       // Update and save new values
      await setDoc(amountSpentRef, { value: newAmountSpent, lastUpdated: moment().format('YY-MM-DD HH:mm:ss') }, { merge: true });
      await setDoc(unitsIntakeRef, { value: newUnitsIntake, lastUpdated: moment().format('YY-MM-DD HH:mm:ss') }, { merge: true });
      await setDoc(bacLevelRef, { value: newBACLevel, lastUpdated: moment().format('YY-MM-DD HH:mm:ss') }, { merge: true });


  
      // Navigate back to the home screen
      navigation.navigate('Home'); // Modify the screen name as needed
    } catch (error) {
      console.error('Error adding favorite as entry:', error);
      Alert.alert('Error', 'Could not add favourite as entry.');
    }
  };
  


  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={favouriteStyles.container}
      onPress={() => handleAddFavoriteAsEntry(item)}
    >
      <Text>
        <Text style={favouriteStyles.categoryText}>Alcohol: </Text>
        <Text style={favouriteStyles.detailsText}>{item.Alcohol}</Text>
      </Text>

      <Text>
        <Text style={favouriteStyles.categoryText}>Amount: </Text>
        <Text style={favouriteStyles.detailsText}>{item.Amount}</Text>
      </Text>

      <Text>
        <Text style={favouriteStyles.categoryText}>Price: </Text>
        <Text style={favouriteStyles.detailsText}>{item.Price}</Text>
      </Text>

      <Text>
        <Text style={favouriteStyles.categoryText}>Type: </Text>
        <Text style={favouriteStyles.detailsText}>{item.Type}</Text>
      </Text>

      <Text>
        <Text style={favouriteStyles.categoryText}>Units: </Text>
        <Text style={favouriteStyles.detailsText}>{item.Units}</Text>
      </Text>

      <TouchableOpacity
        style={favouriteStyles.deleteButton}
        onPress={() => handleDeleteFavourite(item.id)}
      >
        <Text style={favouriteStyles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={Favourites}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default FavouriteList;

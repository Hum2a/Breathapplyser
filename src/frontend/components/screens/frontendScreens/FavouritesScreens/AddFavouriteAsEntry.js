import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView, Dimensions, Image, SafeAreaView } from 'react-native';
import { favouriteStyles, dialogStyles } from '../../../styles/FavouriteStyles/favouriteStyles';
import { getFirestore, collection, getDocs, doc, deleteDoc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import moment from 'moment';
import calculateBACIncrease from '../../../../utils/calculations/calculateBAC'; // Import the calculateBACIncrease function
import Svg, { Polygon } from 'react-native-svg';
import Dialog from 'react-native-dialog';

const FavouriteList = ({ user, navigation }) => {
  const [Favourites, setFavourites] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedFavouriteId, setSelectedFavouriteId] = useState(null);
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

  // const handleDeleteFavourite = async (FavouriteId) => {
  //   try {
  //     await deleteDoc(doc(firestore, user.uid, "Alcohol Stuff", "Favourites", FavouriteId));
  //     setFavourites(Favourites.filter(favourite => favourite.id !== FavouriteId));
  //   } catch (error) {
  //     console.error('Error deleting favourite:', error);
  //     Alert.alert('Error', 'Could not delete favourite.');
  //   }
  // };

  const handleConfirmDelete = async () => {
    if (selectedFavouriteId) {
      try {
        await deleteDoc(doc(firestore, user.uid, "Alcohol Stuff", "Favourites", selectedFavouriteId));
        setFavourites(Favourites.filter(favourite => favourite.id !== selectedFavouriteId));
        Alert.alert('Deleted', 'The favourite has been successfully deleted.');
      } catch (error) {
        console.error('Error deleting favourite:', error);
        Alert.alert('Error', 'Could not delete favourite.');
      }
    }
    setDialogVisible(false);
    setSelectedFavouriteId(null);
  };

  const showDeleteDialog = (FavouriteId) => {
    setSelectedFavouriteId(FavouriteId);
    setDialogVisible(true);
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
      onPress={() => handleAddFavoriteAsEntry(item)}
      style={ favouriteStyles.flatlistContainer }>
      <View style={ favouriteStyles.starView }>
        <Svg height='350' width='350' viewBox="0 0 100 100">
          <Polygon
            points="50,0 61,35 98,35 67,57 76,91 50,70 24,91 33,57 2,35 39,35"
            fill="#65C5F9" // Light blue fill color for the star
            stroke="#003366" // Dark blue for the border color to contrast with the fill
            strokeWidth="1" // Thickness of the border
          />
        </Svg>
        <View style={[favouriteStyles.starContent, { position: 'absolute', top: '34%', left: '10%', right: '10%' }]}>
          <Text style={favouriteStyles.categoryText}>{item.Alcohol}</Text>
          <Text style={favouriteStyles.detailsText}>Amount: {item.Amount}</Text>
          <Text style={favouriteStyles.detailsText}>Price: {item.Price}</Text>
          <Text style={favouriteStyles.detailsText}>Type: {item.Type}</Text>
          <Text style={favouriteStyles.detailsText}>Units: {item.Units}</Text>
          <TouchableOpacity
            style={favouriteStyles.deleteButton}
            onPress={() => showDeleteDialog(item.id)}
          >

            <Image
              source={require('../../../../assets/images/bin.png')}
              style={favouriteStyles.binIcon}
              />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // const renderItem = ({ item }) => (
  //   <TouchableOpacity
  //     style={favouriteStyles.container}
  //     onPress={() => handleAddFavoriteAsEntry(item)}
  //   >
  //     <Text>
  //       <Text style={favouriteStyles.categoryText}>Alcohol: </Text>
  //       <Text style={favouriteStyles.detailsText}>{item.Alcohol}</Text>
  //     </Text>

  //     <Text>
  //       <Text style={favouriteStyles.categoryText}>Amount: </Text>
  //       <Text style={favouriteStyles.detailsText}>{item.Amount}</Text>
  //     </Text>

  //     <Text>
  //       <Text style={favouriteStyles.categoryText}>Price: </Text>
  //       <Text style={favouriteStyles.detailsText}>{item.Price}</Text>
  //     </Text>

  //     <Text>
  //       <Text style={favouriteStyles.categoryText}>Type: </Text>
  //       <Text style={favouriteStyles.detailsText}>{item.Type}</Text>
  //     </Text>

  //     <Text>
  //       <Text style={favouriteStyles.categoryText}>Units: </Text>
  //       <Text style={favouriteStyles.detailsText}>{item.Units}</Text>
  //     </Text>

  //     <TouchableOpacity
  //       style={favouriteStyles.deleteButton}
  //       onPress={() => handleDeleteFavourite(item.id)}
  //     >
  //       <Text style={favouriteStyles.deleteButtonText}>Delete</Text>
  //     </TouchableOpacity>
  //   </TouchableOpacity>
  // );

  return (
    <View style={favouriteStyles.fullscreen}>
      <FlatList
          data={Favourites}
          renderItem={({ item }) => renderItem({ item, navigation })}
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
      </View>
  );
};

export default FavouriteList;

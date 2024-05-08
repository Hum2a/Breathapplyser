import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Dimensions, Image, ScrollView } from 'react-native';
import { favouriteStyles, dialogStyles } from '../../../styles/FavouriteStyles/favouriteStyles';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, collection, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore';
import moment from 'moment';
import Svg, { Polygon } from 'react-native-svg';
import Dialog from 'react-native-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const FavouriteList = ({ user, navigation }) => {
  const [Favourites, setFavourites] = useState([]);
  const firestore = getFirestore();
  const { width, height } = Dimensions.get('window');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedFavouriteId, setSelectedFavouriteId] = useState(null);
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [addVenueDialogVisible, setAddVenueDialogVisible] = useState(false);
  const [deleteSuccessDialogVisible, setDeleteSuccessDialogVisible] = useState(false);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');
  const [newVenueName, setNewVenueName] = useState('');

  useEffect(() => {
    fetchFavourites();
  }, [user]);

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
  
  useEffect(() => {
    fetchVenues();
  }, [user]);  // Fetch venues when user changes
  

  const getCachedData = async (key) => {
    try {
      const jsonString = await AsyncStorage.getItem(key);
      return jsonString != null ? JSON.parse(jsonString) : null;
    } catch (error) {
      console.error('Error retrieving data from cache:', error);
      return null;
    }
  };

  const refreshFavourites = () => {
    fetchFavourites(true);
  };

  const showDeleteDialog = (FavouriteId) => {
    setSelectedFavouriteId(FavouriteId);
    setDialogVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedFavouriteId && selectedVenue) {
      try {
        // Updated path to include the selected venue
        const favouriteDocRef = doc(firestore, user.uid, "Alcohol Stuff", "Venues", selectedVenue, "Favourites", selectedFavouriteId);
        await deleteDoc(favouriteDocRef);
        setFavourites(prevFavourites => prevFavourites.filter(favourite => favourite.id !== selectedFavouriteId));
        setDialogVisible(false); // Close the confirmation dialog
        setDeleteSuccessMessage('The favourite has been successfully deleted.');
        setDeleteSuccessDialogVisible(true);
      } catch (error) {
        console.error('Error deleting favourite:', error);
        setDialogVisible(false); // Close the confirmation dialog
        setDeleteSuccessMessage('The favourite could not be deleted.');
        setDeleteSuccessDialogVisible(true); // Show success message dialog
      }
    } else {
      setDialogVisible(false);
      setDeleteSuccessMessage('Error', 'Invalid venue or favourite ID.');
      setDeleteSuccessDialogVisible(true);
    }
    setDialogVisible(false);
    setSelectedFavouriteId(null);
  };

  const handleCloseDeleteSuccessDialog = () => {
    setDeleteSuccessDialogVisible(false);
  };
  
  

  const renderSquareItem = ({ item, navigation }) => (
    <TouchableOpacity
      style={favouriteStyles.favouriteItem}
      onPress={() => navigation.navigate('EditFavourite', { favorite: item })}
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

  // const renderStarItem = ({ item, navigation }) => (
  //   <TouchableOpacity onPress={() => navigation.navigate('EditFavourite', { favorite: item })} style={ favouriteStyles.flatlistContainer }>
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
  //           {/* <Text style={favouriteStyles.deleteButtonText}>Delete</Text> */}
  //           <Image
  //             source={require('../../../../assets/images/bin.png')}
  //             style={favouriteStyles.binIcon}
  //             />
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   </TouchableOpacity>
  // );

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
  
  

  return (
    <ScrollView style={favouriteStyles.fullscreen}>
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
              fetchFavourites(true);
            }}
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

      <TouchableOpacity onPress={() => fetchFavourites(true)} style={favouriteStyles.refreshButton}>
          <Image
              source={require('../../../../assets/images/refresh-icon.png')}
              style={favouriteStyles.updateButtonImage} 
          />
      </TouchableOpacity>

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

      <Dialog.Container 
        visible={deleteSuccessDialogVisible}
        contentStyle={{
          backgroundColor: 'black',
          borderRadius: 10,
        }}
        >
        <Dialog.Title style={dialogStyles.title}>Deletion Successful</Dialog.Title>
        <Dialog.Description style={dialogStyles.description}>
          {deleteSuccessMessage}
        </Dialog.Description>
        <Dialog.Button
          label="OK"
          onPress={handleCloseDeleteSuccessDialog}
          style={dialogStyles.button} // Apply button styles
        />
      </Dialog.Container>


    </ScrollView>
  );
};

export default FavouriteList;

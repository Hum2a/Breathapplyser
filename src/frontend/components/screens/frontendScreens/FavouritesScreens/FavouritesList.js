import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Dimensions, Image, ScrollView } from 'react-native';
import { favouriteStyles, dialogStyles } from '../../../styles/FavouriteStyles/favouriteStyles';
import { getFirestore, collection, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore';
import moment from 'moment';
import Svg, { Polygon } from 'react-native-svg';
import Dialog from 'react-native-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavouriteList = ({ user, navigation }) => {
  const [Favourites, setFavourites] = useState([]);
  const firestore = getFirestore();
  const { width, height } = Dimensions.get('window');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedFavouriteId, setSelectedFavouriteId] = useState(null);

  useEffect(() => {
    fetchFavourites();
  }, [user]);

  const fetchFavourites = async (ignoreCache = false) => {
    const cacheKey = `favourites_${user.uid}`;
    if (!ignoreCache) {
      const cachedData = await getCachedData(cacheKey);
      if (cachedData) {
        setFavourites(cachedData);
        return;
      }
    }

    try {
      const querySnapshot = await getDocs(collection(firestore, user.uid, "Alcohol Stuff", "Favourites"));
      const FavouritesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavourites(FavouritesData);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(FavouritesData));
    } catch (error) {
      console.error('Error fetching Favourites:', error);
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

  const refreshFavourites = () => {
    fetchFavourites(true);
  };

  const showDeleteDialog = (FavouriteId) => {
    setSelectedFavouriteId(FavouriteId);
    setDialogVisible(true);
  };

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
  

  // const renderSquareItem = ({ item }) => (
  //   <TouchableOpacity
  //     style={favouriteStyles.container}
  //     onPress={() => navigation.navigate('EditFavourite', { favorite: item })}
  //   >
  //     <View style={favouriteStyles.infoContainer}>
  //       <Text style={favouriteStyles.categoryText}>Drink: </Text>
  //       <Text style={favouriteStyles.detailsText}>{item.Alcohol}</Text>
  //     </View>

  //     <View style={favouriteStyles.infoContainer}>
  //       <Text style={favouriteStyles.categoryText}>Amount: </Text>
  //       <Text style={favouriteStyles.detailsText}>{item.Amount}</Text>
  //     </View>

  //     <View style={favouriteStyles.infoContainer}>
  //       <Text style={favouriteStyles.categoryText}>Price: </Text>
  //       <Text style={favouriteStyles.detailsText}>{item.Price}</Text>
  //     </View>

  //     <View style={favouriteStyles.infoContainer}>
  //       <Text style={favouriteStyles.categoryText}>Type: </Text>
  //       <Text style={favouriteStyles.detailsText}>{item.Type}</Text>
  //     </View>

  //     <View style={favouriteStyles.infoContainer}>
  //       <Text style={favouriteStyles.categoryText}>Units: </Text>
  //       <Text style={favouriteStyles.detailsText}>{item.Units}</Text>
  //     </View>

  //     <TouchableOpacity
  //       style={favouriteStyles.deleteButton}
  //       onPress={() => handleDeleteFavourite(item.id)}
  //     >
  //       <Text style={favouriteStyles.deleteButtonText}>Delete</Text>
  //     </TouchableOpacity>
  //   </TouchableOpacity>
    
  // );

  const renderItem = ({ item, navigation }) => (
    <TouchableOpacity onPress={() => navigation.navigate('EditFavourite', { favorite: item })} style={ favouriteStyles.flatlistContainer }>
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
            {/* <Text style={favouriteStyles.deleteButtonText}>Delete</Text> */}
            <Image
              source={require('../../../../assets/images/bin.png')}
              style={favouriteStyles.binIcon}
              />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  

  return (
    <ScrollView style={favouriteStyles.fullscreen}>
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

      <TouchableOpacity onPress={() => fetchAllEntries(true)} style={favouriteStyles.refreshButton}>
          <Image
              source={require('../../../../assets/images/refresh-icon.png')}
              style={favouriteStyles.updateButtonImage} 
          />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default FavouriteList;

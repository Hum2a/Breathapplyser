import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { favouriteStyles } from '../../../styles/FavouriteStyles/favouriteStyles';
import { getFirestore, collection, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore';
import moment from 'moment';
import Svg, { Polygon } from 'react-native-svg';

const FavouriteList = ({ user, navigation }) => {
  const [Favourites, setFavourites] = useState([]);
  const firestore = getFirestore();
  const { width, height } = Dimensions.get('window');

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

    if (user) {
      fetchFavourites();
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

  const renderSquareItem = ({ item }) => (
    <TouchableOpacity
      style={favouriteStyles.container}
      onPress={() => navigation.navigate('EditFavourite', { favorite: item })}
    >
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

      <TouchableOpacity
        style={favouriteStyles.deleteButton}
        onPress={() => handleDeleteFavourite(item.id)}
      >
        <Text style={favouriteStyles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
    
  );

  const renderItem = ({ item, navigation }) => (
    <TouchableOpacity onPress={() => navigation.navigate('EditFavourite', { favorite: item })} style={{ alignItems: 'center', marginBottom: 20 }}>
      <View style={{ position: 'relative' }}>
        <Svg height='350' width='350' viewBox="0 0 100 100">
          <Polygon
            points="50,0 61,35 98,35 67,57 76,91 50,70 24,91 33,57 2,35 39,35"
            fill="#9CEEF1"
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
            onPress={() => handleDeleteFavourite(item.id)}
          >
            <Text style={favouriteStyles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
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

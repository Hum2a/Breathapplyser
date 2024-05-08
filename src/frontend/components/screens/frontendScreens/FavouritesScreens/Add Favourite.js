import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { manualStyles as addStyles } from '../../../styles/DrinkingStyles/addStyles';
import { favouriteStyles } from '../../../styles/FavouriteStyles/favouriteStyles';
import { addNewFavourite } from '../../../../../backend/app/utils/handles/addToFavourites';
import { UserContext } from '../../../../context/UserContext';
import { BackButton } from '../../../buttons/backButton';
import { getFirestore, getDocs, collection } from '@firebase/firestore';

const AddNewFavouriteScreen = ({ navigation }) => {
  const [alcohol, setAlcohol] = useState('');
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [units, setUnits] = useState('');
  const [price, setPrice] = useState('');
  const [calories, setCalories] = useState('');
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');

  const { user } = useContext(UserContext);
  const firestore = getFirestore();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const venueSnapshot = await getDocs(collection(firestore, user.uid, 'Alcohol Stuff', "Venues"));
        const venuesData = venueSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVenues(venuesData);
        if (venuesData.length > 0) {
          setSelectedVenue(venuesData[0].id); // Default to the first venue
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };
    fetchVenues();
  }, [user]);
  

  const handleAddFavourite = () => {
    if (!selectedVenue) {
      Alert.alert('Validation', 'Please select a venue.');
      return;
    }
  
    const favoriteData = {
      Alcohol: alcohol,
      Type: type,
      Amount: amount,
      Units: units,
      Price: price,
      Calories: calories,
      VenueId: selectedVenue, // Include the venue ID
    };
  
    addNewFavourite(user, favoriteData); // Update function to handle venue
    navigation.goBack();
  };
  

  return (
    <View style={addStyles.container}>
      <BackButton />
      <Text style={addStyles.title}>Add Favorite</Text>

      <TextInput
        style={addStyles.input}
        placeholder="Name"
        placeholderTextColor={'navy'}
        value={alcohol}
        onChangeText={setAlcohol}
      />

      <TextInput
        style={addStyles.input}
        placeholder="Type of Alcohol"
        placeholderTextColor={'navy'}
        value={type}
        onChangeText={setType}
      />

      <TextInput
        style={addStyles.input}
        placeholder="Amount"
        placeholderTextColor={'navy'}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        style={addStyles.input}
        placeholder="Units"
        placeholderTextColor={'navy'}
        keyboardType="numeric"
        value={units}
        onChangeText={setUnits}
      />

      <TextInput
        style={addStyles.input}
        placeholder="Price"
        placeholderTextColor={'navy'}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
        style={addStyles.input}
        placeholder="Calories"
        placeholderTextColor={'navy'}
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
      />

    
      <TouchableOpacity 
        style={favouriteStyles.addNewFavouriteButton}
        onPress={handleAddFavourite}
        >
        <Text style={favouriteStyles.addNewFavouriteButtonText}> Save Changes </Text>
      </TouchableOpacity>
      
      <View style={favouriteStyles.pickerContainer2}>
        <Text style={favouriteStyles.pickerText}> Select Venue </Text>
        <Picker
          selectedValue={selectedVenue}
          onValueChange={(itemValue, itemIndex) => setSelectedVenue(itemValue)}
          style={favouriteStyles.picker}
        >
          {venues.map((venue) => (
            <Picker.Item key={venue.id} label={venue.name} value={venue.id} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default AddNewFavouriteScreen;

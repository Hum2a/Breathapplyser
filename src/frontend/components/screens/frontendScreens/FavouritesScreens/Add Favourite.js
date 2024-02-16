import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { addStyles } from '../../../styles/DrinkingStyles/addStyles';
import { addNewFavourite } from '../../../../../backend/app/utils/handles/addToFavourites';
import { UserContext } from '../../../../context/UserContext';

const AddNewFavouriteScreen = ({ navigation }) => {
  const [drinkName, setDrinkName] = useState(''); // Added a new state for drink name
  const [alcohol, setAlcohol] = useState('');
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [units, setUnits] = useState('');
  const [price, setPrice] = useState('');
  const { user } = useContext(UserContext);

  const handleAddFavourite = () => {
    // Create a data object to store the favorite details
    const favoriteData = {
      DrinkName: drinkName, // Include the drink name in the data
      Alcohol: alcohol,
      Type: type,
      Amount: amount,
      Units: units,
      Price: price,
    };

    // Add the favorite to Firebase or perform any other necessary actions
    addNewFavourite(user, favoriteData);

    // Optionally, you can navigate back to the previous screen or perform other actions
    navigation.goBack();
  };

  return (
    <View style={addStyles.container}>
      <Text style={addStyles.title}>Add Favorite</Text>

      <TextInput
        style={addStyles.input}
        placeholder="Drink Name" // Input field for the drink name
        value={drinkName}
        onChangeText={setDrinkName}
      />

      <TextInput
        style={addStyles.input}
        placeholder="Alcohol"
        value={alcohol}
        onChangeText={setAlcohol}
      />

      <TextInput
        style={addStyles.input}
        placeholder="Type (Drink or Shot)"
        value={type}
        onChangeText={setType}
      />

      <TextInput
        style={addStyles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        style={addStyles.input}
        placeholder="Units"
        keyboardType="numeric"
        value={units}
        onChangeText={setUnits}
      />

      <TextInput
        style={addStyles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Button title="Add Favorite" onPress={handleAddFavourite} />
    </View>
  );
};

export default AddNewFavouriteScreen;

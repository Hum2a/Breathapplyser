import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { editStyles } from '../../../styles/HistoryStyles/editStyles';
import { updateDoc, doc, getFirestore } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';

const EditFavourite = ({ route, navigation }) => {
  const { favorite } = route.params;

  const [editedAlcoholValue, setEditedAlcoholValue] = useState(favorite.Alcohol);
  const [editedAmountValue, setEditedAmountValue] = useState(favorite.Amount);
  const [editedPriceValue, setEditedPriceValue] = useState(favorite.Price);
  const [editedTypeValue, setEditedTypeValue] = useState(favorite.Type);
  const [editedUnitsValue, setEditedUnitsValue] = useState(favorite.Units);
  const firestore = getFirestore();
  const { user } = useContext(UserContext);



  const handleSaveChanges = async () => {
    try {
      // Update the Firestore document with the edited data
      const favoriteDocRef = doc(firestore, user.uid, "Alcohol Stuff", "Favourites", favorite.id);
      await updateDoc(favoriteDocRef, {
        Alcohol: editedAlcoholValue,
        Amount: editedAmountValue,
        Price: editedPriceValue,
        Type: editedTypeValue,
        Units: editedUnitsValue,
      });
      // Navigate back to the favorite list screen or close the edit screen
      navigation.goBack();
    } catch (error) {
      console.error('Error updating favorite:', error);
      Alert.alert('Error', 'Could not update favorite.');
    }
  };

  return (
    <View style={editStyles.container}>
      <Text>Edit Favorite Drink</Text>
      <TextInput
        style={editStyles.input}
        placeholder="Alcohol"
        value={editedAlcoholValue}
        onChangeText={(text) => setEditedAlcoholValue(text)}
      />
      <TextInput
        style={editStyles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={editedAmountValue}
        onChangeText={(text) => setEditedAmountValue(text)}
      />
      <TextInput
        style={editStyles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={editedPriceValue}
        onChangeText={(text) => setEditedPriceValue(text)}
      />
      <TextInput
        style={editStyles.input}
        placeholder="Drink or Shot"
        value={editedTypeValue}
        onChangeText={(text) => setEditedTypeValue(text)}
      />
      <TextInput
        style={editStyles.input}
        placeholder="Units"
        keyboardType="numeric"
        value={editedUnitsValue}
        onChangeText={(text) => setEditedUnitsValue(text)}
      />
      <Button title="Save Changes" onPress={handleSaveChanges} />
    </View>
  );
};

export default EditFavourite;

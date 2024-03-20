import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { UserContext } from '../../../../context/UserContext';
import { pickFavsStyles } from '../../../styles/FavouriteStyles/pickFavsStyles';
import FavouriteList from './AddFavouriteAsEntry';

const PickFavouritesScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);

  const handleSelectFavourite = (favourite) => {
    // Navigate back to the AddEntryScreen and pass the selected favorite as a parameter
    navigation.navigate('AddEntry', { selectedFavourite: favourite });
  };
  

  return (
    <View style={pickFavsStyles.container}>
      <Text style={pickFavsStyles.title}>
        Pick a Favourite
      </Text>
      <FavouriteList user={user} onPress={handleSelectFavourite} navigation={navigation}/>
    </View>
  );
};

export default PickFavouritesScreen;

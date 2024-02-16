import React, { useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { UserContext } from '../../../../context/UserContext';
import FavouriteList from './FavouritesList';
import { AddNewFavouritesButton } from '../../../buttons/FavoutitesComponents/FavouritesButtons';

const FavouritesScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);

  // Function to navigate to the screen for adding a new favorite
  const navigateToAddFavorite = () => {
      navigation.navigate('AddFavourite');
  };

  return (
    <View>
      <AddNewFavouritesButton onPress={navigateToAddFavorite}/>
      <FavouriteList user={user} navigation={navigation} />
    </View>
  );
};

export default FavouritesScreen;

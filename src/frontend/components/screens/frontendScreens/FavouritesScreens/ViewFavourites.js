import React, { useContext } from 'react';
import { TouchableOpacity, View, SafeAreaView } from 'react-native';
import { UserContext } from '../../../../context/UserContext';
import FavouriteList from './FavouritesList';
import { AddNewFavouritesButton } from '../../../buttons/FavoutitesComponents/FavouritesButtons';
import { appStyles } from '../../../styles/AppStyles/appStyles';
import { favouriteStyles } from '../../../styles/FavouriteStyles/favouriteStyles';
import { BackButton } from '../../../buttons/backButton';

const FavouritesScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);

  // Function to navigate to the screen for adding a new favorite
  const navigateToAddFavorite = () => {
      navigation.navigate('AddFavourite');
  };

  return (
      <View style={favouriteStyles.container}>
        <BackButton />
        <AddNewFavouritesButton onPress={navigateToAddFavorite}/>
        <FavouriteList user={user} navigation={navigation} />
      </View>
  );
};

export default FavouritesScreen;

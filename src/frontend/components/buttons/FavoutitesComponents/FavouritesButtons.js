import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { manualStyles as addStyles } from '../../styles/DrinkingStyles/addStyles';
import { favouriteStyles } from '../../styles/FavouriteStyles/favouriteStyles';

export const AddNewFavouritesButton = ({ onPress }) => (
    <TouchableOpacity style={favouriteStyles.addNewFavouriteButton} onPress={onPress}>
      <Text style={favouriteStyles.addNewFavouriteButtonText}>Add New Favourite</Text>
    </TouchableOpacity>
  );
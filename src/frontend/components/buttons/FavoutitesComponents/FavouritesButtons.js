import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { addStyles } from '../../styles/DrinkingStyles/addStyles';

export const AddNewFavouritesButton = ({ onPress }) => (
    <TouchableOpacity style={addStyles.button} onPress={onPress}>
      <Text style={addStyles.buttonText}>Add New Favourite</Text>
    </TouchableOpacity>
  );
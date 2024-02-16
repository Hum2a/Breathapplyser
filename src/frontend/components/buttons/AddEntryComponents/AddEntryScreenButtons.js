import React from 'react';
import { addStyles } from '../../styles/DrinkingStyles/addStyles';
import { AnimatedButton } from './AnimatedButton';

export const StartTimeButton = ({ onPress }) => (
  <AnimatedButton
    title="Select Start Time"
    style={addStyles.button}
    textStyle={addStyles.buttonText}
    onPress={onPress}
  />  
);

export const EndTimeButton = ({ onPress }) => (
  <AnimatedButton
    title="Select End Time"
    style={addStyles.button}
    textStyle={addStyles.buttonText}
    onPress={onPress}
  />  
);

export const DatePickerButton = ({ onPress }) => (
  <AnimatedButton
    title="Select Date"
    style={addStyles.button}
    textStyle={addStyles.buttonText}
    onPress={onPress}
  />  
);

export const SaveEntryButton = ({ onPress }) => (
  <AnimatedButton
    title="Save Entry"
    style={addStyles.saveEntryButton}
    textStyle={addStyles.saveEntryButtonText}
    onPress={onPress}
  />
);

export const AddToFavouritesButton = ({ onPress }) => (
  <AnimatedButton
        title="Add to Favourites"
        style={addStyles.favouriteButton}
        textStyle={addStyles.favouriteButtonText}
        onPress={onPress}
      />
);

export const PickFromFavouritesButton = ({ onPress }) => (
  <AnimatedButton
        title="Pick From Favourites"
        style={addStyles.favouriteButton}
        textStyle={addStyles.favouriteButtonText}
        onPress={onPress}
      />
)

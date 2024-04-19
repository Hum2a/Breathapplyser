import React from 'react';
import { TextInput, View } from 'react-native';
import { manualStyles as addStyles } from '../../styles/DrinkingStyles/addStyles';

export const AlcoholInput = ({ value, onChangeText }) => (
  <TextInput
    style={addStyles.input}
    placeholder="Alcohol"
    placeholderTextColor='#03396c'
    value={value}
    onChangeText={onChangeText}
  />
);

export const TypeInput = ({ value, onChangeText }) => (
  <TextInput
    style={addStyles.input}
    placeholder="Drink or Shot"
    placeholderTextColor='#03396c'
    value={value}
    onChangeText={onChangeText}
  />
);

export const AmountInput = ({ value, onChangeText }) => (
  <TextInput
    style={addStyles.input}
    placeholder="Amount"
    placeholderTextColor='#03396c'
    keyboardType="numeric"
    value={value}
    onChangeText={onChangeText}
  />
);

export const UnitsInput = ({ value, onChangeText }) => (
  <TextInput
    style={addStyles.input}
    placeholder="Units"
    placeholderTextColor='#03396c'
    keyboardType="numeric"
    value={value}
    onChangeText={onChangeText}
  />
);

export const PriceInput = ({ value, onChangeText }) => (
  <TextInput
    style={addStyles.input}
    placeholder="Price"
    placeholderTextColor='#03396c'
    keyboardType="numeric"
    value={value}
    onChangeText={onChangeText}
  />
);

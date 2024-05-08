import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import { DisplayStyles as styles } from '../../../styles/SettingStyles/displayStyles';
import DrunkennessDisplayScreen from './Display/DisplayDrunkenness';
import EmojiSettingsScreen from './Display/EmojiCustomisation';
import AnimationsToggle from './Display/AnimationsToggle';
import { BackButton } from '../../../buttons/backButton';

const DisplaySettingsScreen = ({ user, navigation}) => {
  
  const navigateToEmoji = () => {
    navigation.navigate('Emoji');
  }

  const navigateToAnimations = () => {
    navigation.navigate('Animations');
  }

  const navigateToRecentControls = () => {
    navigation.navigate('RecentControls');
  }

  const navigateToCommonControls = () => {
    navigation.navigate('CommonControls');
  }

  return (
    <View style={styles.container}>
      <BackButton/>
      <Text style={styles.header}> Display Settings </Text>
      <DrunkennessDisplayScreen />
      <TouchableOpacity onPress={navigateToEmoji} style={styles.button}>
        <Text style={styles.buttonText}>Emoji Customisation</Text> 
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToAnimations} style={styles.button}>
        <Text style={styles.buttonText}>Animations Toggle</Text> 
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToRecentControls} style={styles.button}>
        <Text style={styles.buttonText}>Recent Drinks Controls</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToCommonControls} style={styles.button}>
        <Text style={styles.buttonText}>Common Drinks Controls</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DisplaySettingsScreen;

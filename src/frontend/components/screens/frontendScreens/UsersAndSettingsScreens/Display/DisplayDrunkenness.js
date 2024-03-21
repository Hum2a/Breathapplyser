import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { UserContext } from '../../../../../context/UserContext';
import { DisplayStyles as styles } from '../../../../styles/SettingStyles/displayStyles';

const DrunkennessDisplayScreen = () => {
  const { user } = useContext(UserContext);
  const [displayMode, setDisplayMode] = useState(null); // Initially set to null
  const firestore = getFirestore();

  useEffect(() => {
    const fetchUserDisplay = async () => {
      try {
        if (!user) return;

        const userDocRef = doc(firestore, user.uid, 'Display');
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setDisplayMode(docSnap.data().DrunkennessDisplay); // Set display mode if exists in Firebase
        }
      } catch (error) {
        console.error('Error fetching user display mode:', error);
      }
    };

    fetchUserDisplay(); // Fetch user display mode when component mounts
  }, [firestore, user]);

  const handleToggle = async (mode) => {
    setDisplayMode(mode); // Update local state

    try {
      if (user) {
        const userDocRef = doc(firestore, user.uid, 'Display');
        await setDoc(userDocRef, { DrunkennessDisplay: mode }, { merge: true });
        console.log('User display mode updated:', mode);
      }
    } catch (error) {
      console.error('Error updating user display mode:', error);
    }
  };

  // Render loading indicator while fetching display mode from Firebase
  if (displayMode === null) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
      <View style={styles.option}>
        <Text style={styles.label}>Display Drunkenness:</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, displayMode === 'emojis' && styles.selectedButton]}
            onPress={() => handleToggle('emojis')}
          >
            <Text style={styles.toggleButtonText}>Emojis</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, displayMode === 'text' && styles.selectedButton]}
            onPress={() => handleToggle('text')}
          >
            <Text style={styles.toggleButtonText}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, displayMode === 'both' && styles.selectedButton]}
            onPress={() => handleToggle('both')}
          >
            <Text style={styles.toggleButtonText}>Both</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};


export default DrunkennessDisplayScreen;

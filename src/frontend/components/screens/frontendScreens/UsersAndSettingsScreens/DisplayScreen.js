import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';

const DisplaySettingsScreen = () => {
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
    <View style={styles.container}>
      <Text style={styles.header}>Display Settings</Text>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b6e6fd',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  option: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedButton: {
    backgroundColor: '#4fc3f7',
  },
});

export default DisplaySettingsScreen;

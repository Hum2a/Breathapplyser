import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
// Import Firestore and your Firebase config as necessary
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { UserContext } from '../../../context/UserContext';
import { BackButton } from '../../buttons/backButton';

const AcceptOnlineRankings = ({ navigation }) => {
  const [optIn, setOptIn] = useState(null);
  const firestore = getFirestore();
  const { user } = useContext(UserContext);

  const handleOptInResponse = async (response) => {
    setOptIn(response);
    if (response) {
      // The user opted in, add their UID to the Firestore collection
      try {
        await setDoc(doc(firestore, 'Users', user.uid), {
          // Add any initial data here. For example, optIn: true to mark their preference
          optIn: true,
        });
        Alert.alert("Success", "You've opted into online rankings!");
        navigation.navigate('Home');
      } catch (error) {
        console.error("Error adding user to rankings:", error);
        Alert.alert("Error", "An error occurred while opting into rankings.");
      }
    } else {
      Alert.alert("Opt-out", "You've opted out of online rankings.");
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />
      {optIn === null && (
        <>
          <Text style={styles.promptText}>Do you want to opt into online rankings?</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleOptInResponse(true)}>
            <Text style={styles.buttonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleOptInResponse(false)}>
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ADD8E6', // Light blue background
  },
  promptText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333', // Darker text for better contrast
  },
  button: {
    backgroundColor: '#007BFF', // A professional shade of blue
    padding: 10,
    borderRadius: 5,
    margin: 10,
    minWidth: 100, // Ensure buttons have a consistent width
    alignItems: 'center',
  },
  buttonText: {
    color: 'white', // White text for contrast
    fontSize: 16,
  }
});

export default AcceptOnlineRankings;

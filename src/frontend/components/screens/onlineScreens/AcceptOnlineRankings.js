import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Dialog from 'react-native-dialog';
import { dialogStyles } from '../../styles/AppStyles/dialogueStyles';
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { UserContext } from '../../../context/UserContext';
import { BackButton } from '../../buttons/backButton';

const AcceptOnlineRankings = ({ navigation }) => {
  const [optIn, setOptIn] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const firestore = getFirestore();
  const { user } = useContext(UserContext);

  const handleOptInResponse = async (response) => {
    setOptIn(response);
    try {
      await setDoc(doc(firestore, 'Users', user.uid), {
        optIn: response,
      }, { merge: true });

      setDialogMessage(response ? "You've opted into online rankings!" : "You've opted out of online rankings.");
      setDialogVisible(true);
    } catch (error) {
      console.error("Error updating opt-in status:", error);
      setDialogMessage("An error occurred while updating your opt-in status.");
      setDialogVisible(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
    navigation.navigate('Home');
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

      <Dialog.Container visible={dialogVisible} contentStyle={dialogStyles.container}>
        <Dialog.Title style={dialogStyles.title}>{optIn ? "Success" : "Opt-out"}</Dialog.Title>
        <Dialog.Description style={dialogStyles.description}>
          {dialogMessage}
        </Dialog.Description>
        <Dialog.Button style={dialogStyles.cancelButton}label="OK" onPress={handleCloseDialog} />
      </Dialog.Container>
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

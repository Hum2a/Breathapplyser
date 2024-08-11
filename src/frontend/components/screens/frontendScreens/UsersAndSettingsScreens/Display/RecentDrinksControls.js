import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Switch } from 'react-native';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { UserContext } from '../../../../../context/UserContext';
import Dialog from 'react-native-dialog';
import { dialogStyles } from '../../../../styles/AppStyles/dialogueStyles';

const RecentDrinksControls = () => {
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [repeatDrinks, setRepeatDrinks] = useState(false);
  const { user } = useContext(UserContext);
  const firestore = getFirestore();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');

  const handleNumberChange = (newNumber) => {
    setNumber(newNumber);
  };

  const handleSave = async () => {
    if (!user) {
      setDialogTitle("Error");
      setDialogMessage("No user logged in.");
      setDialogVisible(true);
      return;
    }
    if (!number || isNaN(number)) {
      setDialogTitle("Error");
      setDialogMessage("Please enter a valid number.");
      setDialogVisible(true);
      return;
    }
    try {
      setLoading(true);
      const settings = {
        number: parseInt(number, 10),
        ignoreRepeatDrinks: repeatDrinks
      };
      const userDocRef = doc(firestore, user.uid, "Recent Drinks Controls");
      await setDoc(userDocRef, settings, { merge: true });
      setDialogTitle("Success");
      setDialogMessage("Settings updated successfully!");
      setDialogVisible(true);
    } catch (error) {
      console.error("Error updating settings:", error);
      setDialogTitle("Error");
      setDialogMessage("Failed to update settings.");
      setDialogVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Recent Drinks Settings</Text>
      <View style={styles.settingContainer}>
        <Text style={styles.descriptionText}>
          Adjust how many recent drink entries the app should display.
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={number}
          onChangeText={handleNumberChange}
          placeholder="Enter number of entries..."
          placeholderTextColor={'#A7BBC7'}
          editable={!loading}
        />
      </View>

      <View style={styles.settingContainer}>
        <Text style={styles.switchLabel}>Ignore Repeat Drinks:</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={repeatDrinks ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={() => setRepeatDrinks(previousState => !previousState)}
          value={repeatDrinks}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Settings</Text>
        </TouchableOpacity>
      )}

      <Dialog.Container 
        visible={dialogVisible} 
        onDismiss={() => setDialogVisible(false)}
        contentStyle={dialogStyles.container}
      >
        <Dialog.Title style={dialogStyles.title}>{dialogTitle}</Dialog.Title>
        <Dialog.Description style={dialogStyles.description}>{dialogMessage}</Dialog.Description>
        <Dialog.Button style={dialogStyles.editButton} label="OK" onPress={() => setDialogVisible(false)} />
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'my_coffee_break',
    color: '#2D3142',
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 16,
    color: '#4F5D75',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
    fontFamily: 'heyam',
  },
  input: {
    color: 'black',
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderColor: '#BCCCDC',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 18,
    fontFamily: 'my_coffee_break',
    backgroundColor: 'white',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'my_coffee_break',
  },
  settingContainer: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#BCCCDC',
    marginBottom: 20,
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#4F5D75',
    fontFamily: 'my_coffee_break',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
  },
  switch: {
    justifyContent: 'flex-end',
  }
});

export default RecentDrinksControls;

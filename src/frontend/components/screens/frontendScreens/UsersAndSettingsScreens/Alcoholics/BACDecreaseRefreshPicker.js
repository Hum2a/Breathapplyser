import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { UserContext } from '../../../../../context/UserContext';
import { BackButton } from '../../../../buttons/backButton';

const BACDecreaseRefreshPicker = () => {
  const [refreshInterval, setRefreshInterval] = useState(10000); // Initial refresh interval value in milliseconds
  const firestore = getFirestore(); // Get the Firestore instance
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchRefreshInterval = async () => {
      try {
        const refreshIntervalRef = doc(firestore, user.uid, 'BAC Refresh Rate');
        const refreshIntervalDoc = await getDoc(refreshIntervalRef);
        if (refreshIntervalDoc.exists()) {
          const data = refreshIntervalDoc.data();
          setRefreshInterval(data.refreshInterval);
        } else {
          console.log("BAC Refresh Rate document does not exist.");
        }
      } catch (error) {
        console.error('Error fetching refresh interval:', error);
      }
    };

    if (user) {
      fetchRefreshInterval();
    }
  }, [user, firestore]);

  const handleIntervalChange = async (value) => {
    setRefreshInterval(value);
    // Update the refresh interval value in the Firestore document
    try {
      await setDoc(doc(firestore, user.uid, 'BAC Refresh Rate'), { refreshInterval: value });
      console.log('Refresh interval updated successfully:', value);
    } catch (error) {
      console.error('Error updating refresh interval:', error);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton/>
      <Text style={styles.label}>BAC Decrease Refresh Rate:</Text>
      <Picker
        selectedValue={refreshInterval}
        onValueChange={handleIntervalChange}
        style={styles.picker}
      >
        <Picker.Item label="10s" value={10000} />
        <Picker.Item label="1 minute" value={60000} />
        <Picker.Item label="10 minutes" value={600000} />
        <Picker.Item label="1 hour" value={3600000} />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Makes the container fill the whole screen
    justifyContent: 'center', // Centers content vertically in the container
    alignItems: 'center', // Centers content horizontally in the container
    backgroundColor: '#E0F2F1', // Light blue background color
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#1565C0', // Dark blue text color
  },
  picker: {
    width: '80%', // Set a specific width for the picker or use 'flex: 1' if it should take up more space
    height: 50,
    color: '#1565C0', // Dark blue text color
  },
});


export default BACDecreaseRefreshPicker;

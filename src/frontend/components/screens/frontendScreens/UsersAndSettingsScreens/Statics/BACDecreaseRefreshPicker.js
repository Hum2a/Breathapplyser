import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { UserContext } from '../../../../../context/UserContext';

const BACDecreaseRefreshPicker = () => {
  const [refreshInterval, setRefreshInterval] = useState(10000); // Initial refresh interval value in milliseconds
  const firestore = getFirestore(); // Get the Firestore instance
  const { user } = useContext(UserContext);

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
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#E0F2F1', // Light blue background color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    color: '#1565C0', // Dark blue text color
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#1565C0', // Dark blue text color
  },
});

export default BACDecreaseRefreshPicker;

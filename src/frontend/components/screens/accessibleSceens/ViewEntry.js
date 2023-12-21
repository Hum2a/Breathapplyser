// ViewEntriesScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { loadDataFromFile, clearEntries } from '../../../utils/database';
import { loadDataFromServer } from '../../../../backend/utils/loadData';
import { styles } from '../../styles/styles';
import CombinedChart from '../../charts/CombinedChart';
import EntriesScreen from '../backendScreens/Entries';

const ViewEntriesScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Load entry data from the server
    const serverUrl = 'http://10.0.2.2:5432/api/entries';  // Update this URL
    loadDataFromServer(serverUrl)
      .then((data) => setEntries(data))
      .catch((error) => console.error('Error loading data:', error));

    // Optionally, you can load data from file as well
    // loadDataFromFile();
  }, []);

  const handleClearEntries = async () => {
    await clearEntries();
    setEntries([]);
    // Optionally, you can load data from file as well
    // loadDataFromFile();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Entries</Text>
      <TouchableOpacity style={styles.button} onPress={handleClearEntries}>
        <Text style={styles.buttonText}>Clear Entries</Text>
      </TouchableOpacity>
      <CombinedChart />
      <EntriesScreen title="Entries" data={entries} />
    </View>
  );
};

export default ViewEntriesScreen;

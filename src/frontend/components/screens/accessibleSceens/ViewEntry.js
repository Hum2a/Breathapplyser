import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { loadDataFromFile, clearEntries } from '../../../utils/database';
import { styles } from '../../styles/styles';
import CombinedChart from '../../charts/CombinedChart';
import EntriesScreen from '../backendScreens/Entries';
import { getServerBaseUrl } from '../../../utils/config/dbURL';

const ViewEntriesScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    console.log('ViewEntries.js: useEffect called');
    const serverUrl = `${getServerBaseUrl()}/api/entries`;
    console.log('ViewEntries.js: Server URL:', serverUrl);

    fetch(serverUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('ViewEntries.js: Data loaded from server:', data);
        setEntries(data);
      })
      .catch((error) => console.error('ViewEntries.js: Error loading data:', error));

    // Optionally, you can load data from file as well
    // loadDataFromFile();
  }, []);

  const handleClearEntries = async () => {
    console.log('ViewEntries.js: handleClearEntries called');
    await clearEntries();
    setEntries([]);
    console.log('ViewEntries.js: Entries cleared');
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

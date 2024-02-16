import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalData, loadDataFromFile, clearEntries } from '../../../utils/database';
import { styles } from '../../styles/styles';
import CombinedChart from '../../charts/CombinedChart';
import EntriesScreen from '../backendScreens/Entries';

const ViewEntriesScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Load entry data from file
    loadDataFromFile();

    // Update entries
    setEntries(globalData.entries);
  }, []);
  
  const handleClearEntries = async () => {
    await clearEntries();
    setEntries([]);
    loadDataFromFile();
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

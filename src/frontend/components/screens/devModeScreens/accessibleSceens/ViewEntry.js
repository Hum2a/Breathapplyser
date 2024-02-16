import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { loadDataFromFile, clearEntries } from '../../../../utils/database';
import { styles } from '../../../styles/styles';
import CombinedChart from '../../../charts/linecharts/CombinedChart';
import EntriesScreen from '../../frontendScreens/EntriesScreens/Entries';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';

const ViewEntriesScreen = ({ navigation }) => {
  console.log('ViewEntriesScreen: Component Rendered');
  const [entries, setEntries] = useState([]);
  const {user} = useContext(UserContext);

  const firestore = getFirestore();
  console.log('ViewEntriesScreen: Firestore Initialized');

  useEffect(() => {
    console.log('ViewEntriesScreen: useEffect Called');
    const fetchEntries = async () => {
      try {
        console.log('ViewEntriesScreen: Fetching entries from Firestore');
        const querySnapshot = await getDocs(collection(firestore, user.uid, "Alcohol Stuff", "entries"));
        const entriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('ViewEntriesScreen: Entries fetched from Firestore:', entriesData);
        setEntries(entriesData);
      } catch (error) {
        console.error('ViewEntriesScreen: Error fetching entries:', error);
      }
    };
  
    fetchEntries();
  }, []);

  const handleClearEntries = async () => {
    console.log('ViewEntriesScreen: handleClearEntries called');
    await clearEntries();
    setEntries([]);
    console.log('ViewEntriesScreen: Entries cleared');
    // Optionally, you can load data from file as well
    // loadDataFromFile();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Entries</Text>
      <TouchableOpacity style={styles.button} onPress={handleClearEntries}>
        <Text style={styles.buttonText}>Clear Entries</Text>
      </TouchableOpacity>
      {/* <CombinedChart /> */}
      <EntriesScreen title="Entries" data={entries} />
    </View>
  );
};

export default ViewEntriesScreen;

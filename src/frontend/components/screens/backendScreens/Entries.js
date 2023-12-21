import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { globalData, saveDataToFile } from '../../../utils/database';
import { styles } from '../../styles/styles';
import { CombinedChart } from '../../charts/IndividualCharts';
import moment from 'moment';

const EntriesScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editedEntry, setEditedEntry] = useState(null);
  const [amount, setAmount] = useState('');
  const [alcohol, setAlcohol] = useState('');
  const [units, setUnits] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    setEntries(globalData.entries);
  }, []);
  
  const handleSelectEntry = (entry) => {
    setSelectedEntry(entry);
    setEditedEntry({ ...entry });
  };

  const handleSaveEntry = () => {
    if (selectedEntry && editedEntry) {
      const updatedEntries = entries.map((entry) =>
        entry.dateTime === selectedEntry.dateTime ? editedEntry : entry
      );
      setEntries(updatedEntries);
      globalData.entries = updatedEntries;
      saveDataToFile();
  
      setSelectedEntry(null);
      setEditedEntry(null);
      Keyboard.dismiss();
    }
  };  

  const handlePressOutsideEditArea = () => {
    setSelectedEntry(null);
    setEditedEntry(null);
    Keyboard.dismiss();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.entry,
        selectedEntry && selectedEntry.dateTime === item.dateTime && styles.selectedEntry,
      ]}
      onPress={() => handleSelectEntry(item)}
    >
      <Text style={styles.entryText}>Date/Time: {item.dateTime}</Text>
      <Text style={styles.entryText}>Amount: {item.amount}</Text>
      <Text style={styles.entryText}>Alcohol: {item.alcohol}</Text>
      <Text style={styles.entryText}>Units: {item.units}</Text>
      <Text style={styles.entryText}>Price: {item.price}</Text>
      <Text style={styles.entryText}>Type: {item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={handlePressOutsideEditArea}>
      <View style={styles.container}>
        <FlatList
          data={entries}
          renderItem={renderItem}
          keyExtractor={(item) => item.dateTime}
        />
        {selectedEntry && (
          <View style={styles.editEntryContainer}>
            <Text style={styles.editEntryTitle}>Edit Selected Entry</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={editedEntry.amount.toString()}
              onChangeText={(value) => setEditedEntry({ ...editedEntry, amount: parseFloat(value) })}
            />
            <TextInput
              style={styles.input}
              placeholder="Alcohol"
              value={editedEntry.alcohol}
              onChangeText={(value) => setEditedEntry({ ...editedEntry, alcohol: value })}
            />
            <TextInput
              style={styles.input}
              placeholder="Units"
              keyboardType="numeric"
              value={editedEntry.units.toString()}
              onChangeText={(value) => setEditedEntry({ ...editedEntry, units: parseInt(value) })}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="numeric"
              value={editedEntry.price.toString()}
              onChangeText={(value) => setEditedEntry({ ...editedEntry, price: parseFloat(value) })}
            />
            <TextInput
              style={styles.input}
              placeholder="Type"
              value={editedEntry.type}
              onChangeText={(value) => setEditedEntry({ ...editedEntry, type: value })}
            />
            <TouchableOpacity style={styles.button} onPress={handleSaveEntry}>
              <Text style={styles.buttonText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EntriesScreen;

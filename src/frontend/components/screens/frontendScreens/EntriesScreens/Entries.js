import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { styles } from '../../../styles/styles';
import moment from 'moment';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import { addToFavourites } from '../../../../../backend/app/utils/handles/addToFavourites';
import { AddToFavouritesButton } from '../../../buttons/AddEntryComponents/AddEntryScreenButtons';

const EntriesScreen = ({ navigation, data }) => {
  console.log('EntriesScreen: Component Rendered');
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editedEntry, setEditedEntry] = useState(null);
  const { user } = useContext(UserContext);

  const firestore = getFirestore();
  console.log('EntriesScreen: Firestore Initialized');

  useEffect(() => {
    console.log('EntriesScreen: useEffect Called');
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      console.log('EntriesScreen: Fetching entries from Firestore');
      const querySnapshot = await getDocs(collection(firestore, user.uid, "Alcohol Stuff", "entries"));
      const entriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('EntriesScreen: Entries fetched from Firestore:', entriesData);
      setEntries(entriesData);
    } catch (error) {
      console.error('EntriesScreen: Error fetching entries:', error);
    }
  };


  const handleSelectEntry = (entry) => {
    console.log('EntriesScreen: Entry Selected:', entry);
    setSelectedEntry(entry);
    setEditedEntry({ ...entry });
  };

  const handleSaveEntry = async () => {
    console.log('EntriesScreen: Save Entry Called');
    if (selectedEntry && editedEntry) {
      try {
        const entryRef = doc(firestore, user.uid, "Alcohol Stuff", "entries", selectedEntry.id);
        console.log('EntriesScreen: Updating Entry:', editedEntry);
        await updateDoc(entryRef, editedEntry);
        await fetchEntries(); // Refresh entries from Firestore
        console.log('EntriesScreen: Entry Updated');
      } catch (error) {
        console.error('EntriesScreen: Error updating entry:', error);
      }

      setSelectedEntry(null);
      setEditedEntry(null);
      Keyboard.dismiss();
    }
  };

  const handleLongPressEntry = (entry) => {
    console.log('EntriesScreen: Long Pressed Entry:', entry);

    // Display a context menu with options "Edit" and "Delete"
    Alert.alert(
      'Entry Options',
      'Choose an action for this entry:',
      [
        {
          text: 'Edit',
          onPress: () => handleSelectEntry(entry),
        },
        {
          text: 'Delete',
          onPress: () => handleDeleteEntry(entry),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  const handleDeleteEntry = async (entry) => {
    console.log('EntriesScreen: Delete Entry:', entry);

    try {
      const entryRef = doc(firestore, user.uid, "Alcohol Stuff", "entries", entry.id);
      await deleteDoc(entryRef);
      await fetchEntries(); // Refresh entries from Firestore
      console.log('EntriesScreen: Entry Deleted');
    } catch (error) {
      console.error('EntriesScreen: Error deleting entry:', error);
    }
  };

  const handlePressOutsideEditArea = () => {
    console.log('EntriesScreen: Press Outside Edit Area');
    setSelectedEntry(null);
    setEditedEntry(null);
    Keyboard.dismiss();
  };

  const handleAddToFavourites = () => {
    const drinkData = {
      alcohol,
      amount,
      price,
      type,
      units,
    };
  
    addToFavourites(user, drinkData); // Pass the user object and drink data to addToFavourites
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.entry,
        selectedEntry && selectedEntry.id === item.id && styles.selectedEntry,
      ]}
      onPress={() => handleSelectEntry(item)}
      onLongPress={() => handleLongPressEntry(item)} // Handle long press
    >
      <Text style={styles.entryText}>Date: {moment(item.date.seconds * 1000).format('YYYY-MM-DD')}</Text>
      <Text style={styles.entryText}>Start Time: {moment(item.start_time).format('HH:mm')}</Text>
      <Text style={styles.entryText}>End Time: {moment(item.end_time).format('HH:mm')}</Text>
      <Text style={styles.entryText}>Amount: {item.amount}</Text>
      <Text style={styles.entryText}>Alcohol: {item.alcohol}</Text>
      <Text style={styles.entryText}>Units: {item.units}</Text>
      <Text style={styles.entryText}>Price: {item.price}</Text>
      <Text style={styles.entryText}>Type: {item.type}</Text>

      <AddToFavouritesButton onPress={handleAddToFavourites}/>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={handlePressOutsideEditArea}>
      <View style={styles.container}>
        <FlatList
          data={entries}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
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

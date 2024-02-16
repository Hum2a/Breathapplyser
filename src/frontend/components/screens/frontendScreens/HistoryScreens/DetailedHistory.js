import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { DetailedHistoryStyles as styles } from '../../../styles/HistoryStyles/detailedHistoryStyles';
import { collection, query, where, getDocs, getFirestore, Timestamp, doc, deleteDoc } from 'firebase/firestore';
import moment from 'moment';
import AllCharts from '../../../charts/linecharts/IndividualCharts';
import { UserContext } from '../../../../context/UserContext';

const DetailedHistoryScreen = ({ route, navigation }) => {
  const { date } = route.params;
  console.log('Route parameters:', route.params); // Logging route parameters

  const [entries, setEntries] = useState([]);
  const firestore = getFirestore();
  const { user } = useContext(UserContext);
  console.log('UserContext:', user); // Logging UserContext

  useEffect(() => {
    console.log('DetailedHistoryScreen: Received date parameter:', date);
    const fetchEntries = async () => {
      try {
        const firestorePath = `${user.uid}/Alcohol Stuff/Entries/${date}/EntryDocs`;
        console.log('Firestore Path:', firestorePath); // Logging Firestore Path

        const startOfDay = moment(date, 'YYYY-MM-DD').startOf('day').toDate();
        const endOfDay = moment(date, 'YYYY-MM-DD').endOf('day').toDate();
        const firestoreStart = Timestamp.fromDate(startOfDay);
        const firestoreEnd = Timestamp.fromDate(endOfDay);
        console.log('Querying Firestore between:', firestoreStart, 'and', firestoreEnd); // Logging the date range for the query

        const q = query(
          collection(firestore, firestorePath),
          where("date", ">=", firestoreStart),
          where("date", "<=", firestoreEnd)
        );

        const querySnapshot = await getDocs(q);
        const entriesData = querySnapshot.docs.map(doc => {
          const entry = doc.data();
          entry.id = doc.id; // Store the document ID
          entry.date = moment(entry.date.toDate()).format('YYYY-MM-DD HH:mm:ss');
          return entry;
        });
        

        console.log('Fetched entries:', entriesData); // Logging fetched entries
        setEntries(entriesData);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };
    fetchEntries();
  }, [date, firestore, user]);

  const chartData = entries.map(entry => ({
    date: entry.date,
    units: entry.units,
  }));
  console.log('ChartData:', chartData); // Logging Chart Data

  const handleLongPressEntry = (entry) => {
    console.log('DetailedHistoryScreen: Long Pressed Entry:', entry); // Logging which entry was long-pressed
    Alert.alert(
      'Entry Options',
      'Choose an action for this entry:',
      [
        {
          text: 'Edit',
          onPress: () => handleEditEntry(entry),
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

  const handleEditEntry = (entry) => {
    console.log('Editing Entry:', entry); // Logging the entry to be edited
    navigation.navigate('EditEntries', { entry }); // Navigate to EditEntryScreen with the entry data
  };
  

  const handleDeleteEntry = async (entry) => {
    console.log('DetailedHistoryScreen: Delete Entry:', entry); // Logging the entry to be deleted
    const firestorePath = `${user.uid}/Alcohol Stuff/Entries/${date}/EntryDocs`;
    console.log('Firestore Path for Deletion:', firestorePath); // Logging Firestore Path for deletion
  
    try {
      const entryRef = doc(firestore, firestorePath, entry.id);
      await deleteDoc(entryRef);
    } catch (error) {
      console.error('Detailed error during deletion:', error);
      if (error instanceof TypeError) {
        console.error('TypeError details:', {
          message: error.message,
          stack: error.stack,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detailed History - {date}</Text>
      <FlatList
        data={entries}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.entryItem}
            onLongPress={() => handleLongPressEntry(item)}
          >
            <Text style={styles.entryText}>Date: {item.date}</Text>
            <Text style={styles.entryText}>Start Time: {moment(item.start_time).format('HH:mm')}</Text>
            <Text style={styles.entryText}>End Time: {moment(item.end_time).format('HH:mm')}</Text>
            <Text style={styles.entryText}>Amount: {item.amount}</Text>
            <Text style={styles.entryText}>Alcohol: {item.alcohol}</Text>
            <Text style={styles.entryText}>Units: {item.units}</Text>
            <Text style={styles.entryText}>Price: {item.price}</Text>
            <Text style={styles.entryText}>Type: {item.type}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default DetailedHistoryScreen;

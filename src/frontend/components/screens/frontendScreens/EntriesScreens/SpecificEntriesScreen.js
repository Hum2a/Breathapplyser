import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { styles } from '../../../styles/styles';

const SpecificEntriesScreen = ({ route }) => {
  const { entriesForSpecificDay } = route.params;

  const renderItem = ({ item }) => (
    <View style={styles.entryItem}>
      {/* Render details of the entry */}
      <Text style={styles.entryText}>Date: {item.date}</Text>
      {/* Include other details you want to display */}
      <Text style={styles.entryText}>Alcohol: {item.alcohol}</Text>
      <Text style={styles.entryText}>Amount: {item.amount}</Text>
      {/* ... add other fields as needed */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entries for Specific Day</Text>
      <FlatList
        data={entriesForSpecificDay}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default SpecificEntriesScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { globalData } from '../../../utils/database';
import { styles } from '../../styles/styles';

const HistoryScreen = ({ navigation }) => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    // Prepare the data for the history screen
    prepareHistoryData();
  }, []);
  
  const prepareHistoryData = () => {
    // Group the entries by date
    const groupedData = globalData.entries.reduce((result, entry) => {
      if (entry && entry.dateTime) { // Add null check
        const date = entry.dateTime.split(' ')[0]; // Extract the date from dateTime
        if (!result[date]) {
          result[date] = [];
        }
        result[date].push(entry);
      }
      return result;
    }, {});

    // Format the grouped data as an array of objects
    const formattedData = Object.keys(groupedData).map((date) => {
      return {
        date,
        entries: groupedData[date],
      };
    });

    // Sort the data by date (most recent first)
    const sortedData = formattedData.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    setHistoryData(sortedData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      <FlatList
        data={historyData}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.historyItem}
            onPress={() => navigation.navigate('DetailedHistory', { date: item.date, entries: item.entries })}
          >
            <Text style={styles.dateText}>{item.date}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default HistoryScreen;

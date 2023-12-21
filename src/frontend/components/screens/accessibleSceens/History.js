import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { styles } from '../../styles/styles';
import { UserContext } from '../../../context/UserContext';
import { getServerBaseUrl } from '../../../utils/config/dbURL';

const HistoryScreen = ({ navigation }) => {
  const [historyData, setHistoryData] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      fetchHistoryData();
    }
  }, [user]);

  const fetchHistoryData = async () => {
    try {
      const apiUrl = `${getServerBaseUrl()}/api/entries/${user.id}`; // Assuming API to fetch entries by user ID
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch history data');
      }
      const entries = await response.json();
      prepareHistoryData(entries);
    } catch (error) {
      console.error('Error fetching history data:', error);
    }
  };

  const prepareHistoryData = (entries) => {
    const groupedData = entries.reduce((result, entry) => {
      const date = entry.dateTime.split(' ')[0];
      if (!result[date]) {
        result[date] = [];
      }
      result[date].push(entry);
      return result;
    }, {});

    const formattedData = Object.keys(groupedData).map(date => ({
      date,
      entries: groupedData[date],
    })).sort((a, b) => new Date(b.date) - new Date(a.date));

    setHistoryData(formattedData);
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

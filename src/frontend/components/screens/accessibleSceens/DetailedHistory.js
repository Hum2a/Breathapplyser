import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList } from 'react-native';
import { styles } from '../../styles/styles';
import { UserContext } from '../../../context/UserContext';
import { getServerBaseUrl } from '../../../utils/config/dbURL';
import AllCharts from '../../charts/IndividualCharts';

const DetailedHistoryScreen = ({ route }) => {
  const { date } = route.params;
  const [entries, setEntries] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      fetchEntriesForDate(date);
    }
  }, [date, user]);

  const fetchEntriesForDate = async (selectedDate) => {
    try {
      const apiUrl = `${getServerBaseUrl()}/api/entries/${user.id}/${selectedDate}`; // Assuming API to fetch entries by user ID and date
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch detailed history data');
      }
      const fetchedEntries = await response.json();
      setEntries(fetchedEntries);
    } catch (error) {
      console.error('Error fetching detailed history data:', error);
    }
  };

  const chartData = entries.map(entry => ({
    date: entry.dateTime,
    units: entry.units,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detailed History - {date}</Text>
      <FlatList
        data={entries}
        renderItem={({ item }) => (
          <View style={styles.entryItem}>
            {/* Render each entry item */}
            <Text>{item.alcohol}</Text>
            <Text>{item.amount}</Text>
            {/* Add more details as required */}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <AllCharts chartData={chartData} />
    </View>
  );
};

export default DetailedHistoryScreen;

import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { styles } from '../../styles/styles';
import EntriesScreen from '../backendScreens/Entries';
import AllCharts from '../../charts/IndividualCharts';

const DetailedHistoryScreen = ({ route }) => {
  const { date, entries } = route.params;

  // Extract the units data for the CombinedChart
  const chartData = entries.map((entry) => {
    return {
      date: entry.dateTime,
      units: entry.units,
    };
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detailed History - {date}</Text>
      <EntriesScreen
        title="Entries"
        data={entries}
        renderChart={() => <AllCharts chartData={chartData} />}
      />
    </View>
  );
};

export default DetailedHistoryScreen;

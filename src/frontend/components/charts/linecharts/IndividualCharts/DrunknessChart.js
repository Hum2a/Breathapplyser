import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { chartStyles } from '../../../styles/ChartStyles/chartStyles';
import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { UserContext } from '../../../../context/UserContext';
import moment from 'moment';
import { chartConfig } from '../chart-handling/chartConfig';

const DrunknessChart = () => {
  const [drunknessValues, setDrunknessValues] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const firestore = getFirestore();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const q = query(collection(firestore, user.uid, "Alcohol Stuff", "entries"), orderBy("date"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        data.formattedDate = moment(data.date.toDate()).format('YYYY-MM-DD');
        entries.push(data);
      });
      setAllEntries(entries);
      filterDataByDate(entries, entries[0]?.formattedDate);
    });

    return () => unsubscribe();
  }, []);

  const filterDataByDate = (entries, date) => {
    setSelectedDate(date);
    let cumulativeDrunkness = 0;
    const filteredEntries = entries.filter(entry => entry.formattedDate === date);
    const newValues = [];
    const labels = [];

    filteredEntries.forEach(entry => {
      cumulativeDrunkness += entry.drunkness || 0;
      newValues.push(cumulativeDrunkness);
      labels.push(moment(entry.date.toDate()).format('HH:mm'));
    });

    setDrunknessValues(newValues);
    setChartLabels(labels);
  };

  const uniqueDates = [...new Set(allEntries.map(entry => entry.formattedDate))];

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedDate}
        onValueChange={(itemValue) => filterDataByDate(allEntries, itemValue)}
        style={styles.pickerStyle}
      >
        {uniqueDates.map(date => (
          <Picker.Item key={date} label={date} value={date} />
        ))}
      </Picker>

      {drunknessValues.length > 0 ? (
        <View>
          <LineChart
            data={{
              labels: chartLabels,
              datasets: [{ data: drunknessValues, color: () => '#7B1FA2' }],
            }}
            width={350}
            height={200}
            chartConfig={{
              ...chartConfig,
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
              withVerticalLabels: true,
            }}
            bezier
            fromZero
          />
          <View style={styles.legendContainer}>
            <View style={[styles.legendItem, { backgroundColor: '#7B1FA2' }]} />
            <Text style={styles.legendLabel}>Drunkness Level</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.noDataText}>No data available for this date.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerStyle: {
    width: '80%',
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendLabel: {
    fontSize: 14,
  },
  noDataText: {
    fontSize: 16,
    marginTop: 20,
  },
});

export default DrunknessChart;

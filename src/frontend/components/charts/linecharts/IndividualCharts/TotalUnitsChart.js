import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { chartStyles } from '../../../styles/HistoryStyles/chartStyles';
import { collection, getFirestore, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { chartConfig } from '../chart-handling/chartConfig';
import { Picker } from '@react-native-picker/picker';
import { UserContext } from '../../../../context/UserContext';
import moment from 'moment';

const TotalUnitsChart = () => {
  const [totalUnitsValues, setTotalUnitsValues] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedDate2, setSelectedDate2] = useState('');
  const [totalUnitsValues2, setTotalUnitsValues2] = useState([]);
  const firestore = getFirestore();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchAllEntries = async () => {
      try {
        const entriesSnapshot = await getDocs(collection(firestore, user.uid, "Alcohol Stuff", "Entries"));
        const allEntriesData = [];

        for (const doc of entriesSnapshot.docs) {
          const dateStr = doc.id; // dateStr is a string in 'YYYY-MM-DD' format
          const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs");
          const entriesSnapshot = await getDocs(entriesRef);

          entriesSnapshot.forEach((entryDoc) => {
            const entry = entryDoc.data();
            entry.date = dateStr; // Use the date string from the document ID
            allEntriesData.push(entry);
          });
        }

        // Sort all entries by date
        allEntriesData.sort((a, b) => moment(a.date, 'YYYY-MM-DD').diff(moment(b.date, 'YYYY-MM-DD')));
        setAllEntries(allEntriesData);

        // Set initial chart data based on the first date
        filterDataByDate(allEntriesData, allEntriesData[0]?.date);
      } catch (error) {
        console.error('Error fetching all entries:', error);
      }
    };

    fetchAllEntries();
  }, []);

  const filterDataByDate = (entries, date, date2 = '') => {
    setSelectedDate(date);
    const filteredEntries = entries.filter(entry => entry.date === date);
    const newValues = [];
    const labels = [];
    let cumulativeUnits = 0;

    // Sort entries within the date by startTime
    filteredEntries.sort((a, b) => {
      return moment(a.startTime, 'YYYY-MM-DD HH:mm:ss').diff(moment(b.startTime, 'YYYY-MM-DD HH:mm:ss'));
    });

    filteredEntries.forEach(entry => {
      cumulativeUnits += parseFloat(entry.units || 0);
      newValues.push(cumulativeUnits);

      // Use the startTime as the label
      const timeLabel = entry.startTime ? moment(entry.startTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm') : 'Unknown Time';
      labels.push(timeLabel);
    });

    setTotalUnitsValues(newValues);
    setChartLabels(labels);

    // Handle data for the second date if in comparison mode
    if (comparisonMode && date2) {
      setSelectedDate2(date2);
      const filteredEntries2 = entries.filter(entry => entry.date === date2);
      const newValues2 = [];
      const labels2 = [];
      let cumulativeUnits2 = 0;

      // Sort entries within the second date by startTime
      filteredEntries2.sort((a, b) => {
        return moment(a.startTime, 'YYYY-MM-DD HH:mm:ss').diff(moment(b.startTime, 'YYYY-MM-DD HH:mm:ss'));
      });

      filteredEntries2.forEach(entry => {
        cumulativeUnits2 += parseFloat(entry.units || 0);
        newValues2.push(cumulativeUnits2);

        // Use the startTime as the label
        const timeLabel = entry.startTime ? moment(entry.startTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm') : 'Unknown Time';
        labels2.push(timeLabel);
      });

      setTotalUnitsValues2(newValues2);
    }
  };

  const uniqueDates = [...new Set(allEntries.map(entry => entry.date))];

  return (
    <View style={chartStyles.chartContainer}>
      {/* Toggle for Comparison Mode */}
      <Text style={chartStyles.toggleLabel}>Comparison Mode:</Text>
      <Switch
        value={comparisonMode}
        onValueChange={() => {
          setComparisonMode(!comparisonMode);
          setTotalUnitsValues2([]);
          setSelectedDate2('');
        }}
      />

      {/* Picker for the first date */}
      <Picker
        selectedValue={selectedDate}
        onValueChange={(itemValue) => filterDataByDate(allEntries, itemValue)}
        style={chartStyles.pickerStyle}
      >
        {uniqueDates.map(date => (
          <Picker.Item key={date} label={date} value={date} />
        ))}
      </Picker>

      {/* Picker for the second date (visible in comparison mode) */}
      {comparisonMode && (
        <Picker
          selectedValue={selectedDate2}
          onValueChange={(itemValue) => {
            setSelectedDate2(itemValue);
            filterDataByDate(allEntries, selectedDate, itemValue);
          }}
          style={chartStyles.pickerStyle}
        >
          {uniqueDates.map(date => (
            <Picker.Item key={date} label={date} value={date} />
          ))}
        </Picker>
      )}

      {totalUnitsValues.length > 0 ? (
        <View>
          <LineChart
            data={{
              labels: chartLabels,
              datasets: [
                { data: totalUnitsValues, color: () => chartConfig.chartColors[0] },
                // Include the second dataset if in comparison mode
                ...(comparisonMode && totalUnitsValues2.length > 0
                  ? [{ data: totalUnitsValues2, color: () => chartConfig.chartColors[1] }]
                  : [])
              ],
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
          />
          <View style={chartStyles.legendContainer}>
            <View style={[chartStyles.legendItem, { backgroundColor: chartConfig.chartColors[0] }]} />
            <Text style={chartStyles.legendLabel}>Total Units</Text>
          </View>
        </View>
      ) : (
        <Text style={chartStyles.noDataText}>No data available for this date.</Text>
      )}
    </View>
  );
}

export default TotalUnitsChart;

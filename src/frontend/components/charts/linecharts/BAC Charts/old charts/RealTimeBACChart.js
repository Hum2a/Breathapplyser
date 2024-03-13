import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { chartStyles } from '../../../../styles/ChartStyles/chartStyles';
import { chartConfig } from '../../chart-handling/chartConfig';
import { collection, getFirestore, query, orderBy, getDocs } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { UserContext } from '../../../../../context/UserContext';
import moment from 'moment';

const RealTimeBACChart = () => {
  const [bacValues, setBacValues] = useState([]);
  const [labels, setLabels] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]); // State to hold unique dates
  const [selectedDate, setSelectedDate] = useState('');
  const firestore = getFirestore();
  const { user } = useContext(UserContext);

  const fetchData = async () => {
    const q = query(collection(firestore, user.uid, "Alcohol Stuff", "entries"), orderBy("date"));
    const querySnapshot = await getDocs(q);
    const entries = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      data.formattedDate = moment(data.date.toDate()).format('YYYY-MM-DD');
      entries.push(data);
    });
    setAllEntries(entries);
    filterDataByDate(entries, entries[0]?.formattedDate);
  };

  useEffect(() => {
    fetchData(); // Fetch data initially
    const interval = setInterval(fetchData, 10000); // Fetch data every 10 seconds
    return () => clearInterval(interval); // Clean up interval
  }, []);

  useEffect(() => {
    if (allEntries.length > 0) {
      // Sort the dates in descending order and set uniqueDates
      const sortedUniqueDates = [...new Set(allEntries.map(entry => entry.formattedDate))].sort((a, b) => moment(b).diff(moment(a)));
      setUniqueDates(sortedUniqueDates);

      // Set the most recent date as selectedDate
      setSelectedDate(sortedUniqueDates[0]);
      filterDataByDate(allEntries, sortedUniqueDates[0]);
    }
  }, [allEntries]);

  const BAC_DECAY_RATE_PER_SECOND = 0.015 / 3600; // Define BAC decay rate

  const filterDataByDate = (entries, date) => {
    setSelectedDate(date);
  
    const filteredEntries = entries.filter(entry => entry.formattedDate === date);
    const hourlyBAC = [];
  
    for (let hour = 0; hour < 24; hour++) {
      const hourMoment = moment(date).hour(hour);
      const closestEntryBeforeHour = getClosestEntryBeforeHour(filteredEntries, hourMoment);
  
      if (closestEntryBeforeHour) {
        const timeDiffSeconds = hourMoment.diff(moment(closestEntryBeforeHour.date.toDate()), 'seconds');
        const estimatedBAC = Math.max(closestEntryBeforeHour.BACIncrease - timeDiffSeconds * BAC_DECAY_RATE_PER_SECOND, 0);
        hourlyBAC.push(estimatedBAC);
      } else {
        hourlyBAC.push(0); // Default to 0 if no entry found
      }
    }
  
    setBacValues(hourlyBAC);
    setLabels(Array.from({ length: 24 }, (_, i) => `${i}:00`)); // Set labels as each hour
  };
  
  // Helper function to find the closest entry before a given hour
  const getClosestEntryBeforeHour = (entries, hourMoment) => {
    return entries.reduce((closest, entry) => {
      const entryMoment = moment(entry.date.toDate());
      if (entryMoment.isBefore(hourMoment) && (closest === null || hourMoment.diff(entryMoment) < hourMoment.diff(moment(closest.date.toDate())))) {
        return entry;
      }
      return closest;
    }, null);
  };
  

  return (
    <View style={chartStyles.chartContainer}>
      <Picker
        selectedValue={selectedDate}
        onValueChange={(itemValue) => filterDataByDate(allEntries, itemValue)}
        style={chartStyles.pickerStyle}
      >
        {uniqueDates.map(date => (
          <Picker.Item key={date} label={date} value={date} />
        ))}
      </Picker>

      {bacValues.length > 0 ? (
        <View>
          <LineChart
            data={{
              labels: labels,
              datasets: [{ data: bacValues, color: () => chartConfig.chartColors[1] }], // Using color from chartColors
            }}
            width={350}
            height={200}
            chartConfig={chartConfig.lineChartConfig} // Use lineChartConfig here
            bezier
          />
          <View style={chartStyles.legendContainer}>
            <View style={[chartStyles.legendItem, { backgroundColor: chartConfig.chartColors[1] }]} />
            <Text style={chartStyles.legendLabel}>Blood Alcohol Content for the day</Text>
          </View>
        </View>
      ) : (
        <Text style={chartStyles.noDataText}>No data available for this date.</Text>
      )}
    </View>
  );
};

export default RealTimeBACChart;

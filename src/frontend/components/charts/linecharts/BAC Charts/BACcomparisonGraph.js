import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import moment from 'moment';
import { UserContext } from '../../../../context/UserContext';
import { combinedBacStyles as styles } from '../../../styles/ChartStyles/BACCStyles/bacChartsStyles';

const BACComparisonGraph = () => {
  const [bacData, setBacData] = useState({});
  const [uniqueDates, setUniqueDates] = useState([]);
  const [selectedDate1, setSelectedDate1] = useState(moment().format("YYYY-MM-DD"));
  const [selectedDate2, setSelectedDate2] = useState('');
  const firestore = getFirestore();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(firestore, user.uid, "Alcohol Stuff", "BAC Level"), orderBy("lastUpdated"));
        const querySnapshot = await getDocs(q);
        const entries = {};
        querySnapshot.forEach(doc => {
          const data = doc.data();
          const formattedDate = moment(data.lastUpdated, "YYYY-MM-DD HH:mm:ss").format('YYYY-MM-DD');
          if (!entries[formattedDate]) {
            entries[formattedDate] = [];
          }
          entries[formattedDate].push(data);
        });
  
        // Convert entries object keys (dates) to an array, sort it in descending order
        const sortedUniqueDates = Object.keys(entries).sort((a, b) => moment(b).diff(moment(a)));
        setUniqueDates(sortedUniqueDates);
  
        // Assuming there's at least one date, set the first date as selectedDate1
        // If there's more than one, set the second most recent date as selectedDate2
        if (sortedUniqueDates.length > 0) {
          setSelectedDate1(sortedUniqueDates[0]);
          setSelectedDate2(sortedUniqueDates.length > 1 ? sortedUniqueDates[1] : '');
        }
  
      } catch (error) {
        console.error('Error fetching BAC data:', error);
      }
    };
  
    fetchData();
  }, [user, firestore]);
  

  const processDataForChart = (date) => {
    console.log(`Processing data for chart on date: ${date}`);
    const dayEntries = bacData[date] || [];
    let hourlyBAC = new Array(24).fill(0);
  
    for (let hour = 0; hour < 24; hour++) {
      const entry = dayEntries.find(entry => moment(entry.lastUpdated, "YYYY-MM-DD HH:mm:ss").hour() === hour);
      // Check if entry exists and entry.value is a number
      if (entry && !isNaN(entry.value)) {
        hourlyBAC[hour] = entry.value;
      }
    }
  
    console.log(`Data for chart processed:`, hourlyBAC);
    return {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      values: hourlyBAC.filter(value => !isNaN(value)) // Filter out any NaN values just to be extra safe
    };
  };
  

  const data1 = processDataForChart(selectedDate1);
  const data2 = processDataForChart(selectedDate2);

  console.log("Data prepared for graph 1:", data1);
  console.log("Data prepared for graph 2:", data2);

  return (
    <View style={styles.container}>
      <Text style={styles.graphTitle}>BAC COMPARISON GRAPH</Text>
      <View style={styles.pickersContainer}>
        <Picker
          selectedValue={selectedDate1}
          onValueChange={(itemValue) => setSelectedDate1(itemValue)}
          style={styles.pickerStyle}
        >
          {uniqueDates.map(date => (
            <Picker.Item key={date} label={date} value={date} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedDate2}
          onValueChange={(itemValue) => setSelectedDate2(itemValue)}
          style={styles.pickerStyle}
        >
          {uniqueDates.map(date => (
            <Picker.Item key={date} label={date} value={date} />
          ))}
        </Picker>
      </View>
      {data1.values.length > 0 && data2.values.length > 0 ? (
        <LineChart
          data={{
            labels: data1.labels,
            datasets: [
              {
                data: data1.values,
                color: () => '#2979FF',
              },
              {
                data: data2.values,
                color: () => '#FF6D00',
              }
            ],
          }}
          width={350}
          height={200}
          chartConfig={{
            backgroundColor: '#b6e6fd', // Light blue background
            backgroundGradientFrom: '#81d4fa', // Lighter shade of blue
            backgroundGradientTo: '#4fc3f7', // Slightly darker shade of blue for gradient end
            decimalPlaces: 4, // Keep the precision for BAC values
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White color for the chart lines
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Using black for readability against the light blue background
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#0293ee' // A blue color that fits well with the theme for the dots stroke
            },
            propsForLabels: { // Customizing label font size
              fontSize: 10,
            }
          }}
          
          bezier
          fromZero
          />
          ) : (
              <Text>Loading data...</Text> // Show a loading message or a spinner
          )}
      <View style={styles.legendContainer}>
        {data1?.values && (
          <>
            <View style={[styles.legendItem, { backgroundColor: '#2979FF' }]} />
            <Text style={styles.legendLabel}>{selectedDate1}</Text>
          </>
        )}
        {data2?.values && (
          <>
            <View style={[styles.legendItem, { backgroundColor: '#FF6D00' }]} />
            <Text style={styles.legendLabel}>{selectedDate2}</Text>
          </>
        )}
      </View>
    </View>
  );
};

export default BACComparisonGraph;

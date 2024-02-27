import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import moment from 'moment';
import { UserContext } from '../../../../context/UserContext';
import { bacComparisonStyles as styles } from '../../../styles/ChartStyles/bacComparisonStyles';

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
        setBacData(entries);
  
        // Set the unique dates from the fetched data
        setUniqueDates(Object.keys(entries));
      } catch (error) {
        console.error('Error fetching BAC data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  const processDataForChart = (date) => {
    const dayEntries = bacData[date] || [];
    let hourlyBAC = new Array(24).fill(0); // Array to hold BAC values for each hour
  
    for (let hour = 0; hour < 24; hour++) {
      const entry = dayEntries.find(entry => moment(entry.lastUpdated, "YYYY-MM-DD HH:mm:ss").hour() === hour);
      if (entry) {
        hourlyBAC[hour] = entry.value; // Modify this line to access the BAC value field in your Firestore document
      }
    }
  
    return {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      values: hourlyBAC
    };
  };

  const data1 = processDataForChart(selectedDate1);
  const data2 = processDataForChart(selectedDate2);

  console.log("Data for graph 1:", data1);
  console.log("Data for graph 2:", data2);

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
      {data1?.values && data2?.values && (
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
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            withVerticalLabels: true,
          }}
          bezier
        />
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

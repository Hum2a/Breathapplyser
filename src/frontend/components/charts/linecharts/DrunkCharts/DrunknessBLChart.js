import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { getFirestore, collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import moment from 'moment';
import { UserContext } from '../../../../context/UserContext';
import { DrunkStyles as styles } from '../../../styles/ChartStyles/DrunknessStyles';

const DrunkennessGraph = () => {
  const [bacData, setBacData] = useState({});
  const [uniqueDates, setUniqueDates] = useState([]);
  const [selectedDate1, setSelectedDate1] = useState(moment().format("YYYY-MM-DD"));
  const [selectedDate2, setSelectedDate2] = useState('');
  const [drunkParameters, setDrunkParameters] = useState([]);
  const firestore = getFirestore();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchDrunkParameters = async () => {
      if (user) {
        const parametersRef = doc(firestore, user.uid, 'Drunk Parameters');
        const docSnap = await getDoc(parametersRef);
        if (docSnap.exists()) {
          setDrunkParameters(docSnap.data().levels);
        }
      }
    };

    fetchDrunkParameters();
  }, [user]);

  useEffect(() => {
    console.log('Fetching BAC data...');
    const fetchData = async () => {
      try {
        const q = query(collection(firestore, user.uid, "Alcohol Stuff", "BAC Level"), orderBy("date"));
        const querySnapshot = await getDocs(q);
        const entries = {};
        querySnapshot.forEach(doc => {
          const data = doc.data();
          const formattedDate = moment(data.date, "YYYY-MM-DD HH:mm:ss").format('YYYY-MM-DD');
          console.log(`Processing data for date: ${formattedDate}`);
          if (!entries[formattedDate]) {
            entries[formattedDate] = [];
          }
          entries[formattedDate].push(data);
        });
        console.log('BAC data fetched and processed:', entries);
        setBacData(entries);
  
        const sortedUniqueDates = Object.keys(entries).sort((a, b) => moment(b).diff(moment(a)));
        console.log('Unique dates set:', sortedUniqueDates);
        setUniqueDates(sortedUniqueDates);
        setSelectedDate1(sortedUniqueDates[0]); // Default to the most recent date
        setSelectedDate2(sortedUniqueDates[1] || sortedUniqueDates[0]);
      } catch (error) {
        console.error('Error fetching BAC data:', error);
      }
    };
  
    if (drunkParameters.length > 0) {
      fetchData();
    }
  }, [user, firestore, drunkParameters]);

  const processDataForChart = (date) => {
    console.log(`Processing data for chart on date: ${date}`);
    const dayEntries = bacData[date] || [];
    const dataPoints = []; // Array to store BAC values for the chart
    const labels = []; // Array to store labels for the chart (e.g., hours)
    const drunkennessLevels = []; // Array to store drunkenness levels for each BAC value

    dayEntries.forEach(entry => {
        const entryTime = moment(entry.date, "YYYY-MM-DD HH:mm:ss");
        const bacValue = parseFloat(entry.value || 0);
        labels.push(entryTime.format('HH:mm')); // Adjust the format as needed
        dataPoints.push(bacValue);

        // Determine the drunkenness level for this BAC value using the firebase data
        const level = getDrunkennessLevelFromFirebase(bacValue);
        drunkennessLevels.push(level); // Store the calculated level
    });

    return {
        labels, // The labels for the chart's X-axis
        bacValues: dataPoints, // The BAC values for the chart's Y-axis
        drunkennessLevels, // Corresponding drunkenness levels for the BAC values
    };
};

  const getDrunkennessLevelFromFirebase = (bac) => {
      let levelInfo = drunkParameters.find(param => {
        const [min, max] = param.range.split(' - ').map(Number);
        return bac >= min && bac <= max;
      });
      return levelInfo ? levelInfo.simple : "Unknown";
  };


  const data1 = processDataForChart(selectedDate1);
  const data2 = processDataForChart(selectedDate2);

  console.log("Data prepared for graph 1:", data1);
  console.log("Data prepared for graph 2:", data2);

  return (
    <View style={styles.container}>
      <Text style={styles.graphTitle}>Drunkenness Comparison Chart</Text>
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
      {data1.bacValues.length > 0 && data2.bacValues.length > 0 ? (
        <LineChart
          data={{
            labels: data1.labels,
            datasets: [
              {
                data: data1.bacValues,
                color: () => '#2979FF',
              },
              {
                data: data2.bacValues,
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
        {data1?.bacValues && (
          <>
            <View style={[styles.legendItem, { backgroundColor: '#2979FF' }]} />
            <Text style={styles.legendLabel}>{selectedDate1}</Text>
          </>
        )}
        {data2?.bacValues && (
          <>
            <View style={[styles.legendItem, { backgroundColor: '#FF6D00' }]} />
            <Text style={styles.legendLabel}>{selectedDate2}</Text>
          </>
        )}
      </View>

      <View style={styles.drunknessLevelsContainer}>
        <View style={styles.column}>
            <Text style={styles.columnHeader}>Data 1</Text>
            {Object.entries(data1.drunkennessLevels).map(([level, time]) => (
            // Check if the level is "Sober" and skip rendering if it is
            level !== "Sober" && (
                <View key={level} style={styles.drunknessLevelContainer}>
                <Text style={styles.drunknessLevel}>{level}</Text>
                <Text style={styles.drunknessTime}>{time}</Text>
                </View>
            )
            ))}
        </View>
        <View style={styles.column}>
            <Text style={styles.columnHeader}>Data 2</Text>
            {Object.entries(data2.drunkennessLevels).map(([level, time]) => (
            // Check if the level is "Sober" and skip rendering if it is
            level !== "Sober" && (
                <View key={level} style={styles.drunknessLevelContainer}>
                <Text style={styles.drunknessLevel}>{level}</Text>
                <Text style={styles.drunknessTime}>{time}</Text>
                </View>
            )
            ))}
        </View>
        </View>



    </View>
  );
};

export default DrunkennessGraph;

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
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
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
    const fetchData = async () => {
      const q = query(collection(firestore, user.uid, "Alcohol Stuff", "BAC Level"), orderBy("date"));
      const querySnapshot = await getDocs(q);
      const entries = {};
      querySnapshot.forEach(doc => {
        const data = doc.data();
        console.log("Raw date from Firestore:", data.date); // This will show you what the dates look like coming from Firestore
        const formattedDate = moment(data.date, "YYYY-MM-DD HH:mm:ss").format('YYYY-MM-DD');
        if (!formattedDate || formattedDate === "Invalid date") {
          console.error("Error parsing date:", data.date);
        } else {
          if (!entries[formattedDate]) {
            entries[formattedDate] = [];
          }
          entries[formattedDate].push(data);
        }
      });
      setBacData(entries);
    
      const sortedUniqueDates = Object.keys(entries).sort((a, b) => moment(b).diff(moment(a)));
      setUniqueDates(sortedUniqueDates);
      setSelectedDate(sortedUniqueDates[0] || moment().format("YYYY-MM-DD"));
    };
    
  
    if (drunkParameters.length > 0) {
      fetchData();
    }
  }, [user, firestore, drunkParameters]);

  const processDataForChart = (date) => {
    const dayEntries = bacData[date] || [];
    const dataPoints = []; // Store BAC values for transition points
    const labels = []; // Store labels for transition points
    let lastLevel = null;
    const levelsReached = {}; // Store the time each level was first reached
  
    dayEntries.forEach(entry => {
      const entryTime = moment(entry.date, "YYYY-MM-DD HH:mm:ss");
      const bacValue = parseFloat(entry.value || 0);
      const currentLevel = getDrunkennessLevelFromFirebase(bacValue);
  
      // Add point only if level changes
      if (currentLevel !== lastLevel) {
        if (!levelsReached[currentLevel]) { // Only add the level if it has not been added before
          levelsReached[currentLevel] = entryTime.format('HH:mm');
          labels.push(entryTime.format('HH:mm')); // Add time label for chart
          dataPoints.push(bacValue); // Add BAC value for chart
        }
        lastLevel = currentLevel;
      }
    });
  
    return {
      labels,
      dataPoints,
      levelsReached // include this in the returned object
    };
  };
  
  const getDrunkennessLevelFromFirebase = (bac) => {
    let levelInfo = drunkParameters.find(param => {
      const [min, max] = param.range.split(' - ').map(Number);
      return bac >= min && bac <= max;
    });
    return levelInfo ? levelInfo.simple : "Unknown";
  };

  const data = processDataForChart(selectedDate);

  return (
    <View style={styles.container}>
      <Text style={styles.graphTitle}>Drunkenness Levels for {selectedDate}</Text>
      <Picker
        selectedValue={selectedDate}
        onValueChange={setSelectedDate}
        style={styles.pickerStyle}
      >
        {uniqueDates.map(date => (
          <Picker.Item key={date} label={date} value={date} />
        ))}
      </Picker>

      {data.dataPoints.length > 0 ? (
        <LineChart
          data={{
            labels: data.labels,
            datasets: [{ data: data.dataPoints, color: () => '#2979FF' }]
          }}
          width={350}
          height={200}
          chartConfig={chartConfig}
          bezier
          fromZero
        />
      ) : (
        <Text>No BAC data available for selected date.</Text>
      )}

      <View style={styles.legendContainer}>
        {Object.entries(data.levelsReached).map(([level, time]) => (
          <View key={level} style={styles.drunknessLevelContainer}>
            <Text style={styles.drunknessLevel}>{level}</Text>
            <Text style={styles.drunknessTime}>{time}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const chartConfig = {
  backgroundColor: '#b6e6fd',
  backgroundGradientFrom: '#81d4fa',
  backgroundGradientTo: '#4fc3f7',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#0293ee'
  },
  propsForLabels: {
    fontSize: 10,
  }
};

export default DrunkennessGraph;

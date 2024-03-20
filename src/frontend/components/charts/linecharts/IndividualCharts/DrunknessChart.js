import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { collection, getFirestore, query, orderBy, getDocs } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import moment from 'moment';
import { chartConfig } from '../chart-handling/chartConfig';
import { drunkStyles as styles } from '../../../styles/ChartStyles/DrunknessStyles';

const BACIncreaseChart = () => {
    const [bacIncreaseValues, setBacIncreaseValues] = useState([]);
    const [chartLabels, setChartLabels] = useState([]);
    const [allEntries, setAllEntries] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [comparisonMode, setComparisonMode] = useState(false);
    const [selectedDate2, setSelectedDate2] = useState('');
    const [bacIncreaseValues2, setBacIncreaseValues2] = useState([]);
    const [markersData, setMarkersData] = useState([]); // Store data for markers

    const firestore = getFirestore();
    const { user } = useContext(UserContext);

    // Define markers for different levels of drunkenness
    const drunkennessMarkers = [
        { label: 'Sober', bacLevel: 0.01 },
        { label: 'Buzzed', bacLevel: 0.03 },
        { label: 'Relaxed', bacLevel: 0.10 },
        { label: 'A Bit of a liability', bacLevel: 0.15 },
        { label: 'Visibly Drunk', bacLevel: 0.20 },
        { label: 'Embarassing', bacLevel: 0.25 },
        { label: 'Sickly', bacLevel: 0.30 },
        { label: 'Either pull or go home', bacLevel: 0.35 },
        { label: 'Find a friend', bacLevel: 0.40 },
        { label: 'Gonna Pass out', bacLevel: 0.45 },
        { label: 'Call an Ambulance', bacLevel: 0.50 },
    ];

    useEffect(() => {
        const fetchAllEntries = async () => {
            try {
                const entriesSnapshot = await getDocs(query(collection(firestore, user.uid, "Alcohol Stuff", "Entries")));
                const allEntriesData = [];

                for (const doc of entriesSnapshot.docs) {
                    const dateStr = doc.id;
                    const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs");
                    const entriesSnapshot = await getDocs(entriesRef);

                    entriesSnapshot.forEach((entryDoc) => {
                        const entry = entryDoc.data();
                        entry.date = dateStr;
                        allEntriesData.push(entry);
                    });
                }

                allEntriesData.sort((a, b) => moment(a.date, 'YYYY-MM-DD').diff(moment(b.date, 'YYYY-MM-DD')));
                setAllEntries(allEntriesData);

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
      let cumulativeBACIncrease = 0;
  
      // Reset markers data for each new set of entries
      setMarkersData([]);
  
      filteredEntries.sort((a, b) => moment(a.startTime, 'YYYY-MM-DD HH:mm:ss').diff(moment(b.startTime, 'YYYY-MM-DD HH:mm:ss')));
  
      filteredEntries.forEach(entry => {
          cumulativeBACIncrease += parseFloat(entry.BACIncrease || 0);
          newValues.push(cumulativeBACIncrease);
          const timeLabel = entry.startTime ? moment(entry.startTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm') : 'Unknown Time';
          labels.push(timeLabel);
      });
  
      setBacIncreaseValues(newValues);
      setChartLabels(labels);
  
      // Calculate crossing points for markers
      drunkennessMarkers.forEach(marker => {
          const crossingPoint = findCrossingPoint(newValues, marker.bacLevel);
          if (crossingPoint !== null) {
              setMarkersData(prevData => [...prevData, { label: marker.label, value: crossingPoint }]);
          }
      });
  
      if (comparisonMode && date2) {
          setSelectedDate2(date2);
          const filteredEntries2 = entries.filter(entry => entry.date === date2);
          const newValues2 = [];
          let cumulativeBACIncrease2 = 0;
  
          filteredEntries2.forEach(entry => {
              cumulativeBACIncrease2 += parseFloat(entry.bacIncrease || 0);
              newValues2.push(cumulativeBACIncrease2);
          });
  
          setBacIncreaseValues2(newValues2);
      }
  };
    
    const findCrossingPoint = (data, threshold) => {
        for (let i = 1; i < data.length; i++) {
            if (data[i - 1] < threshold && data[i] >= threshold) {
                // Interpolate the exact crossing point
                const t = (threshold - data[i - 1]) / (data[i] - data[i - 1]);
                return i - 1 + t;
            }
        }
        return null; // No crossing point found
    };
    const calculateMarkerPosition = (value) => {
      // Ensure that chartConfig properties are defined
      if (chartConfig.min !== undefined && chartConfig.max !== undefined && chartConfig.height !== undefined) {
          // Calculate the percentage of the value within the range
          const percentage = (value - chartConfig.min) / (chartConfig.max - chartConfig.min);
  
          // Calculate the y-position by multiplying the percentage with the chart height
          const yPosition = chartConfig.height * (1 - percentage); // Invert the percentage to ensure correct positioning
  
          // Logging calculated positions
          console.log(`Marker Value: ${value}`);
          console.log(`Calculated Y Position: ${yPosition}`);
  
          return { y: yPosition };
      } else {
          // Return {y: 0} if chartConfig properties are not defined
          return { y: 0 };
      }
  };
  
  

    const uniqueDates = [...new Set(allEntries.map(entry => entry.date))];

    return (
        <View style={styles.container}>
            <Text style={styles.graphTitle}>BAC Cumulative Increase Chart</Text>
            <Switch
                value={comparisonMode}
                onValueChange={() => {
                    setComparisonMode(!comparisonMode);
                    setBacIncreaseValues2([]);
                    setSelectedDate2('');
                }}
            />
            <View style={styles.pickersContainer}>
                <Picker
                    selectedValue={selectedDate}
                    onValueChange={(itemValue) => filterDataByDate(allEntries, itemValue)}
                    style={styles.pickerStyle}
                >
                    {uniqueDates.map(date => (
                        <Picker.Item key={date} label={date} value={date} />
                    ))}
                </Picker>
            </View>
            {comparisonMode && (
                <Picker
                    selectedValue={selectedDate2}
                    onValueChange={(itemValue) => {
                        setSelectedDate2(itemValue);
                        filterDataByDate(allEntries, selectedDate, itemValue);
                    }}
                    style={styles.pickerStyle}
                >
                    {uniqueDates.map(date => (
                        <Picker.Item key={date} label={date} value={date} />
                    ))}
                </Picker>
            )}
            {bacIncreaseValues.length > 0 ? (
                <View>
                <LineChart
                  data={{
                      labels: chartLabels,
                      datasets: [
                          { data: bacIncreaseValues, color: () => '#2979FF' },
                          ...(comparisonMode && bacIncreaseValues2.length > 0
                              ? [{ data: bacIncreaseValues2, color: () => '#FF6D00' }]
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
                  }}
                  bezier
                  fromZero
                  yAxisLabel={({ value }) => {
                      // Find the drunkenness label corresponding to the value
                      const drunkennessLabel = drunkennessMarkers.find(marker => value >= marker.bacLevel)?.label || '';
                      return drunkennessLabel;
                  }}
              />

                <View style={styles.legendContainer}>
                    <View style={[styles.legendItem, { backgroundColor: '#2979FF' }]} />
                    <Text style={styles.legendLabel}>BAC Increase</Text>
                </View>
            </View>            
            ) : (
                <Text style={styles.noDataText}>No data available for this date.</Text>
            )}
        </View>
    );
}

export default BACIncreaseChart;

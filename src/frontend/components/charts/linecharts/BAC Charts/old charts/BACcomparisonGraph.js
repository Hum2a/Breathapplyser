import React, { useState, useEffect, useContext } from 'react';
import { View, Text} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { chartStyles, comparisonChartStyles } from '../../../../styles/HistoryStyles/chartStyles'; 
import { chartConfig } from '../../chart-handling/chartConfig';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { UserContext } from '../../../../../context/UserContext';
import moment from 'moment';

const BACComparisonGraph = () => {
  const [bacData, setBacData] = useState({});
  const [uniqueDates, setUniqueDates] = useState([]);
  const [selectedDate1, setSelectedDate1] = useState('');
  const [selectedDate2, setSelectedDate2] = useState('');
  const firestore = getFirestore();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(firestore, user.uid, "Alcohol Stuff", "BAC Level"), orderBy("date"));
      const querySnapshot = await getDocs(q);
      const entries = {};
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const formattedDate = moment(data.date.toDate()).format('YYYY-MM-DD');
        if (!entries[formattedDate]) {
          entries[formattedDate] = [];
        }
        entries[formattedDate].push(data);
      });
      setBacData(entries);
      setUniqueDates(Object.keys(entries));
    };

    fetchData();
  }, []);

  const BAC_DECAY_RATE_PER_SECOND = 0.015 / 3600; // Standard BAC decay rate per second

  const processDataForChart = (date) => {
    const dayEntries = bacData[date] || [];
    let hourlyBAC = new Array(24).fill(0); // Array to hold BAC values for each hour
  
    for (let hour = 0; hour < 24; hour++) {
      const hourMoment = moment(`${date}`).hour(hour);
      const closestEntryBeforeHour = getClosestEntryBeforeHour(dayEntries, hourMoment);
  
      if (closestEntryBeforeHour) {
        const timeDiffSeconds = hourMoment.diff(moment(closestEntryBeforeHour.date.toDate()), 'seconds');
        const estimatedBAC = Math.max(closestEntryBeforeHour.currentBAC - timeDiffSeconds * BAC_DECAY_RATE_PER_SECOND, 0);
        hourlyBAC[hour] = estimatedBAC;
      }
    }
  
    return {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      values: hourlyBAC
    };
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


  // const processDataForChart = (date) => {
  //   console.log(`Processing for date: ${date}`);
    
  //   const dayEntries = bacData[date] || [];
  //   let hourlyBAC = new Array(24).fill(0);
  
  //   console.log(`Entries for ${date}:`, dayEntries);
  
  //   for (let hour = 0; hour < 24; hour++) {
  //     const hourMoment = moment(date).startOf('day').add(hour, 'hours');
  //     const closestEntryBeforeHour = getClosestEntryBeforeHour(dayEntries, hourMoment);
  
  //     // Log for debugging
  //     console.log(`Hour ${hour}, Hour Moment: ${hourMoment.format()}, Closest Entry:`, closestEntryBeforeHour);
  
  //     if (closestEntryBeforeHour) {
  //       const entryTime = moment(closestEntryBeforeHour.date).set({
  //         hour: moment(closestEntryBeforeHour.selectedEndTime, 'HH:mm').hour(),
  //         minute: moment(closestEntryBeforeHour.selectedEndTime, 'HH:mm').minute()
  //       });
  //       const timeDiffSeconds = hourMoment.diff(entryTime, 'seconds');
  //       const estimatedBAC = Math.max(closestEntryBeforeHour.currentBAC - timeDiffSeconds * BAC_DECAY_RATE_PER_SECOND, 0);
  
  //       console.log(`Estimated BAC for hour ${hour}:`, estimatedBAC);
  
  //       hourlyBAC[hour] = estimatedBAC;
  //     }
  //   }
  
  //   return {
  //     labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  //     values: hourlyBAC
  //   };
  // };
  

  // const getClosestEntryBeforeHour = (entries, hourMoment) => {
  //   let closestEntry = null;
  //   entries.forEach(entry => {
  //     // Parse the end_time of the entry
  //     const entryEndTime = moment(entry.end_time);
  
  //     // Compare with hourMoment
  //     if (entryEndTime.isBefore(hourMoment)) {
  //       // Check if this entry is closer than the current closest
  //       if (!closestEntry || hourMoment.diff(entryEndTime) < hourMoment.diff(moment(closestEntry.end_time))) {
  //         closestEntry = entry;
  //       }
  // //     }
  // //   });
  
  //   // Log for debugging
  //   console.log(`Closest entry for hour ${hourMoment.format('HH:mm')}:`, closestEntry);
  
  //   return closestEntry;
  // };
  
  
  const data1 = processDataForChart(selectedDate1);
  const data2 = processDataForChart(selectedDate2);

  return (
    <View style={chartStyles.chartContainer}>
      <View style={comparisonChartStyles.pickersContainer}>
        <Picker
          selectedValue={selectedDate1}
          onValueChange={(itemValue) => setSelectedDate1(itemValue)}
          style={comparisonChartStyles.pickerStyle}
        >
          {uniqueDates.map(date => (
            <Picker.Item key={date} label={date} value={date} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedDate2}
          onValueChange={(itemValue) => setSelectedDate2(itemValue)}
          style={comparisonChartStyles.pickerStyle}
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
                color: () => '#FF6A5C',
              },
              {
                data: data2.values,
                color: () => '#297AB1',
              }
            ],
          }}
          width={350}
          height={200}
          chartConfig={{
            ...chartConfig.lineChartConfig,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier
        />
      )}
      <View style={chartStyles.legendContainer}>
        {data1?.values && (
          <>
            <View style={[chartStyles.legendItem, { backgroundColor: '#FF6A5C' }]} />
            <Text style={chartStyles.legendLabel}>{selectedDate1}</Text>
          </>
        )}
        {data2?.values && (
          <>
            <View style={[chartStyles.legendItem, { backgroundColor: '#297AB1' }]} />
            <Text style={chartStyles.legendLabel}>{selectedDate2}</Text>
          </>
        )}
      </View>
    </View>
  );
};

export default BACComparisonGraph;


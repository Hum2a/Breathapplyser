import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getFirestore, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import moment from 'moment';
import { UserContext } from '../../../../context/UserContext';

const BACGraphLast12Hours = () => {
  const [bacData, setBacData] = useState([]);
  const firestore = getFirestore();
  const { user } = useContext(UserContext);
  let queryCount = 0;
  let totalReads = 0;

  useEffect(() => {
    const fetchBACDataLast12Hours = async () => {
      const twelveHoursAgo = moment().subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss');
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
    
      try {
        const bacRef = collection(firestore, user.uid, "Alcohol Stuff", "BAC Level");
        const q = query(bacRef, where("date", ">=", twelveHoursAgo), where("date", "<=", now), orderBy("date"));
        const querySnapshot = await getDocs(q);
        queryCount += 1;
        totalReads += querySnapshot.docs.length;
        const fetchedData = [];
    
        querySnapshot.forEach(doc => {
          const data = doc.data();
          const entry = {
            value: data.currentBAC || data.value,
            date: data.date, // Now a string
          };
          fetchedData.push(entry);
        });
    
        setBacData(fetchedData);
      } catch (error) {
        console.error("Error fetching BAC data:", error);
      }
    };
    
    if (user) {
      fetchBACDataLast12Hours();
    }
  }, [user]);

  // Prepare the data for the graph
  const labels = [];
  const dataPoints = [];
  const currentHour = moment().startOf('hour');
  for (let i = 11; i >= 0; i--) {
    const hourLabel = currentHour.clone().subtract(i, 'hours').format('HH');
    labels.push(hourLabel);
    const bacEntry = bacData.find(entry => moment(entry.date).format('HH') === currentHour.clone().subtract(i, 'hours').format('HH'));
    if (bacEntry && !isNaN(bacEntry.value)) {
      dataPoints.push(bacEntry ? bacEntry.value : 0);
    } else {
      dataPoints.push(0);
    }
  }

  console.log("Total Firebase queries made:", queryCount);
  console.log("Total reads made to Firebase directory:", totalReads);

  return (
    <View>
      {bacData.length > 0 ? (
        <LineChart
          data={{
            labels,
            datasets: [{ data: dataPoints }]
          }}
          width={Dimensions.get("window").width}
          height={220}
          yAxisLabel=""
          yAxisSuffix=" BAC"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: '#b6e6fd',
            backgroundGradientFrom: '#81d4fa',
            backgroundGradientTo: '#4fc3f7',
            decimalPlaces: 4,
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
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      ) : (
        <Text>No BAC data available for the last 12 hours.</Text>
      )}
    </View>
  );
};

export default BACGraphLast12Hours;

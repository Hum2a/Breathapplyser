import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { collection, query, orderBy, onSnapshot, getFirestore } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import moment from 'moment';

const RealTimeBACChart = () => {
  const [bacData, setBacData] = useState([]);
  const { user } = useContext(UserContext);
  const firestore = getFirestore();

  useEffect(() => {
    if (user) {
      const bacRef = collection(firestore, user.uid, "Alcohol Stuff", "BAC Level");
      const q = query(bacRef, orderBy("date"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const today = moment().startOf('day');
        const fetchedData = snapshot.docs.map(doc => ({
          value: doc.data().currentBAC || doc.data().value,
          date: doc.data().date,
        })).filter(d => moment(d.date).isSameOrAfter(today));

        setBacData(fetchedData);
        console.log('Today\'s BAC data set in state', fetchedData);
      }, (error) => {
        console.error("Error fetching real-time BAC data:", error);
      });

      return () => unsubscribe();
    }
  }, [user]);

  // Prepare the data for the graph
  const labels = bacData.map(d => moment(d.date).format('HH:mm'));
  const dataPoints = bacData.map(d => d.value);

  return (
    <View style={{ padding: 10, backgroundColor: '#ffffff' }}>
      {bacData.length > 0 ? (
        <LineChart
          data={{
            labels,
            datasets: [{ data: dataPoints }]
          }}
          width={Dimensions.get("window").width - 20} // Subtract padding
          height={220}
          yAxisLabel=""
          yAxisSuffix=" BAC"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#81d4fa',
            backgroundGradientTo: '#0277bd',
            decimalPlaces: 4, // Consider reducing this for readability
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#29b6f6',
              fill: '#29b6f6'
            },
            propsForBackgroundLines: {
              strokeDasharray: '', // Solid background lines
              strokeWidth: 1,
              stroke: '#e0f7fa'
            },
            propsForLabels: {
              fontFamily: 'HelveticaNeue',
              fontSize: 12, // Adjusted for better readability
            }
          }}
          bezier
          fromZero='true'
          style={{
            marginVertical: 8,
            borderRadius: 16,
            elevation: 4, // Android shadow
            shadowColor: '#000000', // iOS shadows
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          }}
        />
      ) : (
        <Text style={{ fontFamily: 'HelveticaNeue', fontSize: 16, textAlign: 'center' }}>No BAC data available for today.</Text>
      )}
    </View>
  );
};

export default RealTimeBACChart;

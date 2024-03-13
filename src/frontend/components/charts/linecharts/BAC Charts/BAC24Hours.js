import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getFirestore, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import moment from 'moment';
import { UserContext } from '../../../../context/UserContext';

const BACGraphLast12Hours = () => {
  const [bacData, setBacData] = useState([]);
  const firestore = getFirestore();
  console.log("Firestore initialized:", firestore);
  const { user } = useContext(UserContext);
  console.log("User from context:", user);

  useEffect(() => {
    console.log("Effect to fetch BAC data triggered");
    const fetchBACDataLast12Hours = async () => {
      const twelveHoursAgo = moment().subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss');
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
    
      try {
        const bacRef = collection(firestore, user.uid, "Alcohol Stuff", "BAC Level");
        // Adjust query to compare strings
        const q = query(bacRef, where("lastUpdated", ">=", twelveHoursAgo), where("lastUpdated", "<=", now), orderBy("lastUpdated"));
        const querySnapshot = await getDocs(q);
        const fetchedData = [];
    
        querySnapshot.forEach(doc => {
          const data = doc.data();
          const entry = {
            value: data.currentBAC || data.value,
            lastUpdated: data.lastUpdated, // Now a string
          };
          fetchedData.push(entry);
        });
    
        setBacData(fetchedData);
      } catch (error) {
        console.error("Error fetching BAC data:", error);
      }
    };
    

    if (user) {
      console.log("User exists, fetching BAC data...");
      fetchBACDataLast12Hours();
    } else {
      console.log("No user found, skipping BAC data fetch.");
    }
  }, [user]);

  console.log("BAC data state:", bacData);
  // Prepare the data for the graph
  const labels = bacData.map(entry => moment(entry.lastUpdated).format('HH:mm'));
  console.log("Chart labels:", labels);
  const dataPoints = bacData.map(entry => entry.value);
  console.log("Chart data points:", dataPoints);

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

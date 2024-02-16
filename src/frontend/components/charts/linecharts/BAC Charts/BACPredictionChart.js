import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';

const PredictBACDecrease = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [isPredictedTime, setIsPredictedTime] = useState(true); // State to track whether to display predicted time or real-time
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchMostRecentBAC = async () => {
      const firestore = getFirestore();
      const bacRef = collection(firestore, user.uid, 'Alcohol Stuff', 'BAC Level');
      const q = query(bacRef, orderBy('lastUpdated', 'desc'), limit(1));

      try {
        const querySnapshot = await getDocs(q);
        let initialBAC = 0;
        querySnapshot.forEach((doc) => {
          // Assuming your document has a field named 'value' for the BAC level
          initialBAC = doc.data().value;
        });
        const prediction = generatePredictionData(initialBAC);
        setPredictionData(prediction);
      } catch (error) {
        console.error("Error fetching BAC data:", error);
      }
    };

    fetchMostRecentBAC();
  }, []);

  // Generates prediction data for BAC decrease
  function generatePredictionData(currentBAC) {
    const metabolismRate = 0.015; // BAC decrease per hour
    let hours = 0;
    const dataPoints = [];

    while (currentBAC > 0) {
      dataPoints.push({ hour: hours, BAC: currentBAC.toFixed(4) });
      currentBAC -= metabolismRate;
      hours++;
    }

    // Filter out data points with BAC value of 0
    const filteredDataPoints = dataPoints.filter(point => parseFloat(point.BAC) !== 0);

    // Generate labels with intervals of every hour
    const labels = [];
    for (let i = 0; i <= hours; i++) {
      labels.push(`${i}h`);
    }

    return {
      labels: isPredictedTime ? labels : filteredDataPoints.map(point => {
        // Use lastUpdated if available, otherwise use timestamp
        const time = point.lastUpdated || point.timestamp;
        const date = new Date(time);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
      }),
      datasets: [{
        data: filteredDataPoints.map(point => point.BAC),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }]
    };
  }


  // Function to toggle between displaying predicted time and real-time
  const toggleTimeDisplay = () => {
    setIsPredictedTime(!isPredictedTime);
  };

// Function to check if there are non-zero BAC values
const hasNonZeroValues = predictionData && predictionData.datasets[0].data.some(value => value !== "0.0000");

return (
  <View>
    {hasNonZeroValues ? (
      <>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
          <TouchableOpacity onPress={toggleTimeDisplay}>
            <Text>{isPredictedTime ? 'Show Real-Time' : 'Show Predicted Time'}</Text>
          </TouchableOpacity>
        </View>
        <Text>{isPredictedTime ? 'Predicted BAC Decrease Over Time' : 'Real-Time BAC Decrease Over Time'}</Text>
        <LineChart
          data={predictionData}
          width={Dimensions.get('window').width - 16} // from react-native
          height={220}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 3, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726'
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </>
    ) : (
      <Text>No data available</Text>
    )}
  </View>
);

};

export default PredictBACDecrease;

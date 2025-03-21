import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import { combinedBacStyles as styles } from '../../../styles/ChartStyles/BACCStyles/bacChartsStyles';
import moment from 'moment';

const PredictBACDecrease = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [isPredictedTime, setIsPredictedTime] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchMostRecentBAC = async () => {
      const firestore = getFirestore();
      const bacRef = collection(firestore, user.uid, 'Alcohol Stuff', 'BAC Level');
      const q = query(bacRef, orderBy('date', 'desc'), limit(1));

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const initialBAC = doc.data().value;
        if (initialBAC === 0) {
          setPredictionData(null);
        }
        else {
        const prediction = generatePredictionData(initialBAC);
        setPredictionData(prediction);
        }
      }
    };

    fetchMostRecentBAC();
  }, [user]);

  function generatePredictionData(currentBAC) {
    const metabolismRate = 0.015;
    let hours = 0;
    const dataPoints = [];
    const now = moment(); // Current time

    while (currentBAC > 0) {
      dataPoints.push(currentBAC.toFixed(4));
      currentBAC -= metabolismRate;
      hours++;
    }

    // Generate labels for predicted time (in hours)
    const interval = Math.max(Math.floor(hours / 6), 1);
    const predictedLabels = Array.from({ length: hours }, (_, i) => (i % interval === 0 ? `${i}h` : ''));

    // Generate labels for real-world time
    const realTimeLabels = Array.from({ length: hours }, (_, i) => {
        const futureTime = now.clone().add(i, 'hours');
        return i % interval === 0 ? futureTime.format('HH:mm') : '';
    });

    return {
      predictedLabels,
      realTimeLabels,
      datasets: [{
        data: dataPoints,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
      }]
    };
}

  const toggleTimeDisplay = () => {
    setIsPredictedTime(!isPredictedTime);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.graphTitle}>{isPredictedTime ? 'Predicted BAC Decrease Over Time' : 'Real-Time BAC Decrease Over Time'}</Text>
      {!predictionData ? (
        <Text style={styles.soberText}>You are Sober.</Text>
      ) : (
        <LineChart
            data={{
                labels: isPredictedTime ? predictionData.predictedLabels : predictionData.realTimeLabels,
                datasets: predictionData.datasets
            }}
          width={Dimensions.get('window').width - 16}
          height={220}
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
          formatXLabel={(label) => label} // This line ensures that only filtered labels are shown
          withVerticalLabels
          withHorizontalLabels
          fromZero
        />
      )}
      <TouchableOpacity onPress={toggleTimeDisplay} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>{isPredictedTime ? 'Show Real-Time' : 'Show Predicted Time'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PredictBACDecrease;

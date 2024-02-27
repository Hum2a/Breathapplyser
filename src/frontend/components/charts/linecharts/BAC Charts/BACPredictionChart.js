import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import { bacPredictionStyles as styles } from '../../../styles/ChartStyles/bacPredicitionStyles';

const PredictBACDecrease = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [isPredictedTime, setIsPredictedTime] = useState(true); 
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

  function generatePredictionData(currentBAC) {
    const metabolismRate = 0.015; 
    let hours = 0;
    const dataPoints = [];

    while (currentBAC > 0) {
      dataPoints.push({ hour: hours, BAC: currentBAC.toFixed(4), lastUpdated: Date.now() }); 
      currentBAC -= metabolismRate;
      hours++;
    }

    const filteredDataPoints = dataPoints.filter(point => parseFloat(point.BAC) !== 0);

    const labels = [];
    for (let i = 0; i <= hours; i++) {
      labels.push(`${i}h`);
    }

    if (!isPredictedTime) {
      const lastUpdateTime = dataPoints[0].lastUpdated;
      const startTime = new Date(lastUpdateTime);
      const startHour = startTime.getHours();
      const startMinutes = startTime.getMinutes();
      for (let i = 0; i < filteredDataPoints.length; i++) {
        const time = new Date(lastUpdateTime + i * 3600 * 1000); 
        const hour = time.getHours();
        const minutes = time.getMinutes();
        labels[i] = `${hour}:${minutes < 10 ? '0' + minutes : minutes}`; 
        filteredDataPoints[i].hour = startHour + i;
      }
    }

    return {
      labels: isPredictedTime ? labels : filteredDataPoints.map(point => {
        const time = point.lastUpdated;
        const date = new Date(time);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
      }),
      datasets: [{
        data: filteredDataPoints.map(point => point.BAC),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, 
        strokeWidth: 2 
      }]
    };
  }

  const toggleTimeDisplay = () => {
    setIsPredictedTime(!isPredictedTime);
    fetchDataAndUpdatePrediction();
  };

  const fetchDataAndUpdatePrediction = async () => {
    const firestore = getFirestore();
    const bacRef = collection(firestore, user.uid, 'Alcohol Stuff', 'BAC Level');
    const q = query(bacRef, orderBy('lastUpdated', 'desc'), limit(1));
    try {
      const querySnapshot = await getDocs(q);
      let initialBAC = 0;
      querySnapshot.forEach((doc) => {
        initialBAC = doc.data().value;
      });
      const prediction = generatePredictionData(initialBAC);
      setPredictionData(prediction);
    } catch (error) {
      console.error("Error fetching BAC data:", error);
    }
  };

  const hasNonZeroValues = predictionData && predictionData.datasets[0].data.some(value => value !== "0.0000");

  return (
    <View>
      {hasNonZeroValues ? (
        <>
          <Text style={styles.graphTitle}>{isPredictedTime ? 'Predicted BAC Decrease Over Time' : 'Real-Time BAC Decrease Over Time'}</Text>
          <LineChart
            data={predictionData}
            width={Dimensions.get('window').width - 16} 
            height={220}
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 3, 
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
          <TouchableOpacity onPress={toggleTimeDisplay} style={styles.toggleButton}>
            <Text style={styles.toggleButtonText}>{isPredictedTime ? 'Show Real-Time' : 'Show Predicted Time'}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
};

export default PredictBACDecrease;

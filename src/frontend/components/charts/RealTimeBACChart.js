import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { chartStyles } from '../styles/styles';
import { globalData } from '../../utils/database';
import { chartConfig } from './chartConfig';

const RealTimeBACChart = () => {
    console.log('----------REAL TIME BAC CHART LOG---------');
  const [bacValues, setBACValues] = useState([globalData.globalBAC]);
  const [timerInterval, setTimerInterval] = useState(1000); // Default interval: 1 second

  
  const fetchStoredBACValues = async () => {
    try {
      const storedValues = await AsyncStorage.getItem('realTimeBACValues');
      if (storedValues) {
        const parsedValues = JSON.parse(storedValues);
        setBACValues(parsedValues);
      }
    } catch (error) {
      console.log('Error fetching stored BAC values:', error);
    }
  };

  useEffect(() => {
    fetchStoredBACValues();
  }, []);

  useEffect(() => {
    const storeBACValues = async () => {
      try {
        await AsyncStorage.setItem('realTimeBACValues', JSON.stringify(bacValues));
      } catch (error) {
        console.log('Error storing BAC values:', error);
      }
    };

    storeBACValues();
  }, [bacValues]);

  useEffect(() => {
    const timer = setInterval(updateBACValues, timerInterval);

    return () => {
      clearInterval(timer);
    };
  }, [timerInterval, bacValues]);

  const updateBACValues = () => {
    const previousBAC = bacValues[bacValues.length - 1];
    const decreasePerSecond = 0.015 / 3600;
    const decreasePerMinute = decreasePerSecond * 60;
    const decreasePerHour = decreasePerMinute * 60;

    // Calculate the elapsed time since the last update
    const elapsedSeconds = timerInterval / 1000;
    
    // Calculate the decrease in BAC based on the elapsed time
    const decrease = decreasePerSecond * elapsedSeconds;

    // Ensure that the decrease doesn't cause the BAC to become negative
    const currentBAC = Math.max(previousBAC - decrease, 0);
  
    setBACValues((prevBACValues) => {
      const newBACValues = [...prevBACValues, currentBAC];
      globalData.globalBAC = currentBAC; // Store the current BAC value in globalData
      return newBACValues;
    });
  };
  

  const handleIntervalChange = (interval) => {
    console.log('Interval changed:', interval);
    setTimerInterval(interval);
  };

  console.log('Render BAC Values:', bacValues);
  console.log('----------------------------------');

  return (
    <View style={chartStyles.chartContainer}>
      <LineChart
        data={{
          labels: [],
          datasets: [
            {
              data: bacValues,
              color: () => chartConfig.chartColors[1],
            },
          ],
        }}
        width={350}
        height={200}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          withVerticalLabels: true,
          xAxisLabelCount: 0,
        }}
        bezier
      />
      <View style={chartStyles.legendContainer}>
        <View style={[chartStyles.legendItem, { backgroundColor: chartConfig.chartColors[1] }]} />
        <Text style={chartStyles.legendLabel}>Real Time Blood Alcohol Content</Text>
      </View>
      <View style={chartStyles.intervalButtonsContainer}>
        <TouchableOpacity
          style={[
            chartStyles.intervalButton,
            timerInterval === 1000 && chartStyles.intervalButtonActive,
          ]}
          onPress={() => handleIntervalChange(1000)}
        >
          <Text>1 Second</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            chartStyles.intervalButton,
            timerInterval === 60000 && chartStyles.intervalButtonActive,
          ]}
          onPress={() => handleIntervalChange(60000)}
        >
          <Text>1 Minute</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            chartStyles.intervalButton,
            timerInterval === 3600000 && chartStyles.intervalButtonActive,
          ]}
          onPress={() => handleIntervalChange(3600000)}
        >
          <Text>1 Hour</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RealTimeBACChart;

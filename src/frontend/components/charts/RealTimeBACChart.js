import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { chartStyles } from '../styles/styles';
import { chartConfig } from './chartConfig';
import { getServerBaseUrl } from '../../utils/config/dbURL';

const RealTimeBACChart = () => {
  const [bacValues, setBACValues] = useState([]);
  const [timerInterval, setTimerInterval] = useState(1000); // Default interval: 1 second

  useEffect(() => {
    const fetchBACValue = async () => {
      try {
        const response = await fetch(`${getServerBaseUrl()}/api/realTimeBAC`);
        if (!response.ok) {
          throw new Error('Failed to fetch real-time BAC data');
        }
        const data = await response.json();
        setBACValues((prevValues) => [...prevValues, data.currentBAC]);
      } catch (error) {
        console.error('Error fetching real-time BAC data:', error);
      }
    };

    const timer = setInterval(fetchBACValue, timerInterval);
    return () => clearInterval(timer);
  }, [timerInterval]);

  const handleIntervalChange = (interval) => {
    setTimerInterval(interval);
  };

  return (
    <View style={chartStyles.chartContainer}>
      <LineChart
        data={{
          labels: bacValues.map((_, index) => index.toString()),
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
        }}
        bezier
      />
      <View style={chartStyles.legendContainer}>
        <View style={[chartStyles.legendItem, { backgroundColor: chartConfig.chartColors[1] }]} />
        <Text style={chartStyles.legendLabel}>Real Time Blood Alcohol Content</Text>
      </View>
      <View style={chartStyles.intervalButtonsContainer}>
        {/* Interval buttons */}
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

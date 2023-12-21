import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { chartStyles } from '../styles/styles';
import { chartConfig } from './chartConfig';
import { getServerBaseUrl } from '../../utils/config/dbURL';

const BloodAlcoholContentChart = () => {
  const [bacData, setBacData] = useState([]);
  const [bacValues, setBacValues] = useState([]);

  useEffect(() => {
    const fetchBacData = async () => {
      try {
        const response = await fetch(`${getServerBaseUrl()}/api/bacChartData`);
        if (!response.ok) {
          throw new Error('Failed to fetch BAC chart data');
        }
        const data = await response.json();
        setBacData(data);
        calculateBacValues(data);
      } catch (error) {
        console.error('Error fetching BAC chart data:', error);
      }
    };

    fetchBacData();
  }, []);

  const calculateBacValues = (data) => {
    let cumulativeBAC = 0;
    const calculatedValues = data.map((entry, index) => {
      const bacIncrease = entry.BACIncrease || 0;
      cumulativeBAC += bacIncrease;

      const bacDecrease = cumulativeBAC * (0.015 / 100) * (index + 1);
      cumulativeBAC = Math.max(cumulativeBAC - bacDecrease, 0);

      return cumulativeBAC;
    });

    setBacValues(calculatedValues);
  };

  if (bacData && bacData.length > 0) {
    return (
      <View style={chartStyles.chartContainer}>
        <LineChart
          data={{
            labels: bacData.map((data) => data.date),
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
          <Text style={chartStyles.legendLabel}>Blood Alcohol Content at the time of entries being stored</Text>
        </View>
      </View>
    );
  }

  return <Text>Loading chart data...</Text>;
};

export default BloodAlcoholContentChart;

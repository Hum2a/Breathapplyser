import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { chartStyles } from '../styles/styles';
import { chartConfig } from './chartConfig';
import { getServerBaseUrl } from '../../utils/config/dbURL';

const DrunknessChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(`${getServerBaseUrl()}/api/drunknessChartData`);
        if (!response.ok) {
          throw new Error('Failed to fetch drunkness chart data');
        }
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching drunkness chart data:', error);
      }
    };
    fetchChartData();
  }, []);

  if (!chartData.length) {
    return <Text>Loading chart data...</Text>;
  }

  const drunknessValues = chartData.map((data, index) => {
    return data.drunkness || 0; // Assuming API provides drunkness value directly
  });

    return (
      <View style={chartStyles.chartContainer}>
        <LineChart
          data={{
            labels: chartData.map((data) => data.date),
            datasets: [
              {
                data: drunknessValues,
                color: () => chartConfig.chartColors[2],
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
          <View style={[chartStyles.legendItem, { backgroundColor: chartConfig.chartColors[2] }]} />
          <Text style={chartStyles.legendLabel}>Drunkness Level</Text>
        </View>
      </View>
    );
  }

  return null;

export default DrunknessChart;

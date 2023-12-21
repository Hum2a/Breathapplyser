import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { chartStyles } from '../styles/styles';
import { chartConfig } from './chartConfig';
import { getServerBaseUrl } from '../../utils/config/dbURL';

const TotalUnitsChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(`${getServerBaseUrl()}/api/unitsData`);
        if (!response.ok) {
          throw new Error('Failed to fetch units data');
        }
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching units data:', error);
      }
    };

    fetchChartData();
  }, []);

  const calculateTotalUnitsValues = (data) => {
    let cumulativeUnits = 0;
    return data.map(entry => {
      cumulativeUnits += parseFloat(entry.units);
      return cumulativeUnits;
    });
  };

  if (chartData && chartData.length > 0) {
    const totalUnitsValues = calculateTotalUnitsValues(chartData);

    return (
      <View style={chartStyles.chartContainer}>
        <LineChart
          data={{
            labels: chartData.map((data) => data.date),
            datasets: [{
              data: totalUnitsValues,
              color: () => chartConfig.chartColors[0],
            }],
          }}
          width={350}
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            withVerticalLabels: true,
          }}
          bezier
        />
        <View style={chartStyles.legendContainer}>
          <View style={[chartStyles.legendItem, { backgroundColor: chartConfig.chartColors[0] }]} />
          <Text style={chartStyles.legendLabel}>Total Units</Text>
        </View>
      </View>
    );
  }

  return null;
};

export default TotalUnitsChart;

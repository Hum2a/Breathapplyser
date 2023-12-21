import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { chartStyles } from '../styles/styles';
import { globalData } from '../../utils/database';
import { chartConfig } from './chartConfig';

const BloodAlcoholContentChart = () => {
  console.log('----------BLOOD ALCOHOL CONTENT CHART LOG----------');
  const chartData = globalData.chartData;
  const bacValues = [];
  
  let cumulativeBAC = 0;

  if (chartData && chartData.length > 0) {
    chartData.forEach((data, index) => {
      const units = parseFloat(data.units);
      const hoursElapsed = index + 1; // Assuming one entry per hour

      if (!isNaN(units)) {
        const bacIncrease = data.BACIncrease || 0; // Get BAC increase from the entry
        cumulativeBAC += bacIncrease; // Add BAC increase to cumulative BAC

        const bacDecrease = cumulativeBAC * (0.015 / 100) * hoursElapsed; // Calculate BAC decrease based on hours elapsed
        cumulativeBAC -= bacDecrease; // Subtract BAC decrease from cumulative BAC

        bacValues.push(cumulativeBAC); // Store the cumulative BAC value
      } else {
        console.log('Invalid units value:', data.units);
      }

      console.log('BACIncrease value:', data.BACIncrease);
    });

    console.log('BAC Values:', bacValues);
    console.log('--------------------------------------');

    return (
      <View style={chartStyles.chartContainer}>
        <LineChart
          data={{
            labels: chartData.map((data) => data.date),
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

  return null;
};

export default BloodAlcoholContentChart;

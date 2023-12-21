import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { chartStyles } from '../styles/styles';
import { globalData } from '../../utils/database';
import { chartConfig } from './chartConfig';

const DrunknessChart = () => {
  console.log('----------DRUNKNESS LEVEL CHART LOG----------');
  const chartData = globalData.chartData;
  const drunknessValues = [];

  let cumulativeDrunkness = 0;

  if (chartData && chartData.length > 0) {
    chartData.forEach((data) => {
      cumulativeDrunkness += data.drunkness || 0;
      drunknessValues.push(cumulativeDrunkness);

      console.log('Drunkness value:', data.drunkness);
    });

    console.log('Drunkness Values:', drunknessValues);
    console.log('--------------------------------------');

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
};

export default DrunknessChart;

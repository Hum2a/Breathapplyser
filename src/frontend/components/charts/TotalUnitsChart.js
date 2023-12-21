import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { chartStyles } from '../styles/styles';
import { globalData } from '../../utils/database';
import { chartConfig } from './chartConfig';

const TotalUnitsChart = () => {
  console.log('----------TOTAL UNITS CHART LOG----------');
  const chartData = globalData.chartData;
  const totalUnitsValues = [];

  let cumulativeUnits = 0;

  if (chartData && chartData.length > 0) {
    chartData.forEach((data) => {
      const units = parseFloat(data.units);

      if (!isNaN(units)) {
        cumulativeUnits += units;
        totalUnitsValues.push(cumulativeUnits);
      } else {
        console.log('Invalid units value:', data.units);
      }

      console.log('Units value:', data.units);
    });

    console.log('Total Units Values:', totalUnitsValues);
    console.log('--------------------------------------');

    return (
      <View style={chartStyles.chartContainer}>
        <LineChart
          data={{
            labels: chartData.map((data) => data.date),
            datasets: [
              {
                data: totalUnitsValues,
                color: () => chartConfig.chartColors[0],
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
          <View style={[chartStyles.legendItem, { backgroundColor: chartConfig.chartColors[0] }]} />
          <Text style={chartStyles.legendLabel}>Total Units</Text>
        </View>
      </View>
    );
  }

  return null;
};

export default TotalUnitsChart;

import React from 'react';
import { View, Text } from 'react-native';
import { chartStyles } from '../styles/styles';
import BloodAlcoholContentChart from './BACChart';
import DrunknessChart from './DrunknessChart';
import TotalUnitsChart from './TotalUnitsChart';
import RealTimeBACChart from './RealTimeBACChart';

const AllCharts = ({ chartData }) => {
  if (chartData && chartData.length > 0) {
    return (
      <View style={chartStyles.chartContainer}>
        <BloodAlcoholContentChart chartData={chartData} />
        <DrunknessChart chartData={chartData} />
        <TotalUnitsChart chartData={chartData} />
        <RealTimeBACChart />
      </View>
    );
  }
  
  return (
    <View style={chartStyles.chartContainer}>
      <Text>No data available</Text>
    </View>
  );
};

export default AllCharts;

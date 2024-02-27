import React from 'react';
import { View, Text } from 'react-native';
import { chartStyles } from '../../styles/ChartStyles/chartStyles';
import {
  DrunknessChart,
  TotalUnitsChart,
  AmountSpentChart,
  BACChart,
  BACPredictionChart,
  BACComparisonGraph,
} from '../chartIndex';

const AllCharts = () => {
  return (
    <View style={chartStyles.chartContainer}>
      <BACPredictionChart />
      <BACComparisonGraph />
      {/* <BACChart /> */}
      {/* <DrunknessChart />  */}
      <TotalUnitsChart />  
      <AmountSpentChart />
    </View>
  );
};

export default AllCharts;

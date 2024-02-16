import React from 'react';
import { View, Text } from 'react-native';
import { chartStyles } from '../../styles/HistoryStyles/chartStyles';
import {
  DrunknessChart,
  TotalUnitsChart,
  AmountSpentChart,
  BACChart,
  BACPredictionChart,
} from '../chartIndex';

const AllCharts = () => {
  return (
    <View style={chartStyles.chartContainer}>
      <BACPredictionChart />
      {/* <BACChart /> */}
      <DrunknessChart /> 
      <TotalUnitsChart />  
      <AmountSpentChart />
    </View>
  );
};

export default AllCharts;

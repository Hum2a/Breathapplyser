import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { chartStyles } from '../../../../styles/ChartStyles/chartStyles';
import {
  BACPredictionChart,
  BACComparisonGraph,
} from '../../../../charts/chartIndex';
const BACCharts = () => {
  return (
    <SafeAreaView style={chartStyles.fullScreen}>
      <ScrollView >
          <View style={chartStyles.chartContainer}>
              <BACPredictionChart />
              <BACComparisonGraph />
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BACCharts;

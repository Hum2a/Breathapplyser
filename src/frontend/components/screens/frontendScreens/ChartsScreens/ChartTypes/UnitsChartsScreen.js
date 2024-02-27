import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { chartStyles } from '../../../../styles/ChartStyles/chartStyles';
import { TotalUnitsChart } from '../../../../charts/chartIndex';

const UnitsCharts = () => {
  return (
    <SafeAreaView style={chartStyles.fullScreen}>
      <ScrollView>
        <View style={chartStyles.chartContainer}>
          <TotalUnitsChart />  
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UnitsCharts;

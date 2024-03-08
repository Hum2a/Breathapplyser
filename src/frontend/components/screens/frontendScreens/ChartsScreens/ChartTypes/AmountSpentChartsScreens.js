import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { chartStyles } from '../../../../styles/ChartStyles/chartStyles';
import { AmountSpentChart } from '../../../../charts/chartIndex';

const AmountSpentCharts = () => {
  return (
    <SafeAreaView style={chartStyles.fullScreen}>
      <ScrollView >
          <View style={chartStyles.chartContainer}>
              <AmountSpentChart />
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AmountSpentCharts;

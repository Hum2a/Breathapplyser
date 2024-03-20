import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { chartStyles } from '../../../../styles/ChartStyles/chartStyles';
import { DrunknessChart } from '../../../../charts/chartIndex';

const DrunkCharts = () => {
  return (
    <SafeAreaView style={chartStyles.fullScreen}>
      <ScrollView >
          <View style={chartStyles.chartContainer}>
              <DrunknessChart />
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DrunkCharts;

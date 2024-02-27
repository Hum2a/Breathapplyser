import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { chartStyles } from '../../../../styles/ChartStyles/chartStyles';
import { DrinkTypesChart } from '../../../../charts/chartIndex';

const TypesCharts = () => {
  return (
    <SafeAreaView style={chartStyles.fullScreen} >
      <ScrollView>
          <View style={chartStyles.chartContainer}>
              <DrinkTypesChart />
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TypesCharts;

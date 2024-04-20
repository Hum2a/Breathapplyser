import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { chartStyles } from '../../../../styles/ChartStyles/chartStyles';
import { TotalUnitsChart } from '../../../../charts/chartIndex';
import { BackButton } from '../../../../buttons/backButton';

const UnitsCharts = () => {
  return (
    <SafeAreaView style={chartStyles.fullScreen}>
      <ScrollView>
        <View style={chartStyles.chartContainer}>
          <BackButton />
          <TotalUnitsChart />  
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UnitsCharts;

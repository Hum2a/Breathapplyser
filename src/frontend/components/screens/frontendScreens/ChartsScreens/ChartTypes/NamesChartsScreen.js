import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { chartStyles } from '../../../../styles/ChartStyles/chartStyles';
import { DrinkNamesChart } from '../../../../charts/chartIndex';

const NamesCharts = () => {
  return (
    <SafeAreaView style={chartStyles.fullScreen}>
    <ScrollView>
        <View style={chartStyles.chartContainer}>
            <DrinkNamesChart />
        </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default NamesCharts;

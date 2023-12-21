import React from 'react';
import { View, ScrollView } from 'react-native';
import { globalData } from '../../../utils/database';
import AllCharts from '../../charts/IndividualCharts';

const ChartsScreen = () => {
  const { chartData } = globalData;

  return (
    <ScrollView>
      <View>
        <AllCharts chartData={chartData} />
      </View>
    </ScrollView>
  );
};

export default ChartsScreen;

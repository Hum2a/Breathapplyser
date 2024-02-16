import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import AllCharts from '../../../charts/linecharts/IndividualCharts';

const ChartsScreen = () => {
  return (
    <ScrollView>
      <View>
        {/* Directly display all the charts */}
        <AllCharts />
      </View>
    </ScrollView>
  );
};

export default ChartsScreen;

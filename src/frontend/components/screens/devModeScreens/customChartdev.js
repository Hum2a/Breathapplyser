import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line, Text as SvgText, G } from 'react-native-svg';
import { CustomLineChart } from '../../charts/linecharts/custom_chart/customLineChart';

const CustomChartDev = () => {
  const data = [10, 20, 15, 25, 30, 35, 20]; // Your data points
  return (
    <View style={styles.container}>
      <CustomLineChart data={data} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomChartDev;

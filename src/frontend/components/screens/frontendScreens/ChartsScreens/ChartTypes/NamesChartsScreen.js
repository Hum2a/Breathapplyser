import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Switch, StyleSheet } from 'react-native';
import { chartStyles } from '../../../../styles/ChartStyles/chartStyles';
import { DrinkNamesChart, DrinkNamesPieChart } from '../../../../charts/chartIndex';

const NamesCharts = () => {
  const [isBarChartVisible, setIsBarChartVisible] = useState(true); // State to toggle between charts

  return (
    <SafeAreaView style={chartStyles.fullScreen}>
      <View style={chartStyles.chartContainer}>
        <View style={styles.toggleContainer}>
          <Text>{isBarChartVisible ? 'Bar Chart' : 'Pie Chart'}</Text>
          <Switch
            value={isBarChartVisible}
            onValueChange={() => setIsBarChartVisible(!isBarChartVisible)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isBarChartVisible ? "#f5dd4b" : "#f4f3f4"}
            style={styles.switchStyle}
          />
        </View>
        {isBarChartVisible ? <DrinkNamesChart /> : <DrinkNamesPieChart />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    alignItems: 'center',
  },
  switchStyle: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], // Make the switch larger
    marginLeft: 10, // Add some spacing between the text and the switch
  },
});

export default NamesCharts;

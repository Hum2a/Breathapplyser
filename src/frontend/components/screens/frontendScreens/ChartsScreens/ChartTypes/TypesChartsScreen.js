import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Switch } from 'react-native';
import { chartStyles } from '../../../../styles/ChartStyles/chartStyles';
import { DrinkTypesBarChart, DrinkTypesPieChart } from '../../../../charts/chartIndex';
import { BackButton } from '../../../../buttons/backButton';

const TypesCharts = () => {
  const [isBarChart, setIsBarChart] = useState(true); // State to toggle between charts

  return (
    <SafeAreaView style={chartStyles.fullScreen}>
      <ScrollView contentContainerStyle={chartStyles.chartContainer}>
        <BackButton />
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <Text>{isBarChart ? 'Bar Chart' : 'Pie Chart'}</Text>
          <Switch
            value={isBarChart}
            onValueChange={() => setIsBarChart(!isBarChart)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isBarChart ? "#f5dd4b" : "#f4f3f4"}
            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }} // Scale the switch
          />
        </View>
        {isBarChart ? <DrinkTypesBarChart /> : <DrinkTypesPieChart />}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TypesCharts;

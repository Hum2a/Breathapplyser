import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { DrunkScreenStyles } from '../../../../styles/ChartStyles/DrunknessStyles';
import { DrunknessENTRIESChart, DrunknessBLChart } from '../../../../charts/chartIndex';

const DrunkCharts = () => {
  const [showEntriesChart, setShowEntriesChart] = useState(false); // State to control visibility of entries chart
  const [showBLChart, setShowBLChart] = useState(false); // State to control visibility of BL chart

  return (
    <SafeAreaView style={DrunkScreenStyles.fullScreen}>
      <ScrollView>
        {/* Toggle button for Entries chart */}
        <TouchableOpacity onPress={() => setShowEntriesChart(!showEntriesChart)} style={DrunkScreenStyles.toggleButton}>
          <Text style={DrunkScreenStyles.toggleButtonText}>{showEntriesChart ? 'Hide Entries Chart' : 'Show Entries Chart'}</Text>
        </TouchableOpacity>

        {/* Entries chart */}
        {showEntriesChart && (
          <View style={DrunkScreenStyles.chartContainer}>
            <DrunknessENTRIESChart />
          </View>
        )}

        {/* Toggle button for BL chart */}
        <TouchableOpacity onPress={() => setShowBLChart(!showBLChart)} style={DrunkScreenStyles.toggleButton}>
          <Text style={DrunkScreenStyles.toggleButtonText}>{showBLChart ? 'Hide BL Chart' : 'Show BL Chart'}</Text>
        </TouchableOpacity>

        {/* BL chart */}
        {showBLChart && (
          <View style={DrunkScreenStyles.chartContainer}>
            <DrunknessBLChart />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DrunkCharts;

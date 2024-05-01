import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { DrunkScreenStyles } from '../../../../styles/ChartStyles/DrunknessStyles';
import { DrunknessENTRIESChart, DrunknessBLChart } from '../../../../charts/chartIndex';
import { BackButton } from '../../../../buttons/backButton';

const DrunkCharts = ({ navigation }) => {
  const [showEntriesChart, setShowEntriesChart] = useState(false); // State to control visibility of entries chart
  const [showBLChart, setShowBLChart] = useState(false); // State to control visibility of BL chart

  const back = () => {
    navigation.pop(1);
  };

  return (
    <SafeAreaView style={DrunkScreenStyles.fullScreen}>
      <ScrollView style={DrunkScreenStyles.chartContainer}>
        <TouchableOpacity style={DrunkScreenStyles.iconContainer} onPress={back}>
          <Image source={require('../../../../../assets/images/back_arrow.png')} style={DrunkScreenStyles.icon} />
        </TouchableOpacity>
        {/* Toggle button for Entries chart */}
        <TouchableOpacity onPress={() => setShowEntriesChart(!showEntriesChart)} style={DrunkScreenStyles.button}>
          <Text style={DrunkScreenStyles.buttonText}>{showEntriesChart ? 'Hide Entries Chart' : 'Show Entries Chart'}</Text>
        </TouchableOpacity>

        {showEntriesChart && (
          <View style={DrunkScreenStyles.chartContainer}>
            <DrunknessENTRIESChart />
          </View>
        )}

        {/* Toggle button for BL chart */}
        <TouchableOpacity onPress={() => setShowBLChart(!showBLChart)} style={DrunkScreenStyles.button}>
          <Text style={DrunkScreenStyles.buttonText}>{showBLChart ? 'Hide BL Chart' : 'Show BL Chart'}</Text>
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

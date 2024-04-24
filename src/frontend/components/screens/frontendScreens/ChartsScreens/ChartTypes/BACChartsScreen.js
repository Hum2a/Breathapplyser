import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { chartStyles } from '../../../../styles/ChartStyles/chartStyles';
import {
  BACChart,
  BACPredictionChart,
  BACComparisonGraph,
  BACEntriesChart,
  BAC12Hours,
  BACTrackingChart
} from '../../../../charts/chartIndex';
import { BackButton } from '../../../../buttons/backButton';

const BACCharts = () => {
  const [showBAC12Hours, setShowBAC12Hours] = useState(false);
  const [showBACPredictionChart, setShowBACPredictionChart] = useState(false);
  const [showBACComparisonGraph, setShowBACComparisonGraph] = useState(false);
  const [showBACEntriesChart, setShowBACEntriesChart] = useState(false);
  const [showBACChart, setShowBACChart] = useState(false);
  const [showBACTrackingChart, setShowBACTrackingChart] = useState(false);

  
  return (
    <SafeAreaView style={chartStyles.fullScreen}>
      <ScrollView>
        <View style={chartStyles.chartContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowBAC12Hours(!showBAC12Hours)}
          >
            <Text style={styles.buttonText}>Last 12 Hours</Text>
          </TouchableOpacity>
          {showBAC12Hours && <BAC12Hours />}
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowBACPredictionChart(!showBACPredictionChart)}
          >
            <Text style={styles.buttonText}>Time till Sober</Text>
          </TouchableOpacity>
          {showBACPredictionChart && <BACPredictionChart />}

          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowBACComparisonGraph(!showBACComparisonGraph)}
          >
            <Text style={styles.buttonText}>Compare 2 Full Days</Text>
          </TouchableOpacity>
          {showBACComparisonGraph && <BACComparisonGraph />}

          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowBACEntriesChart(!showBACEntriesChart)}
          >
            <Text style={styles.buttonText}>BAC of each entry</Text>
          </TouchableOpacity>
          {showBACEntriesChart && <BACEntriesChart />}

          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowBACChart(!showBACChart)}
          >
            <Text style={styles.buttonText}>Cumulative Increase of the Night</Text>
          </TouchableOpacity>
          {showBACChart && <BACChart />}

          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowBACTrackingChart(!showBACTrackingChart)}
          >
            <Text style={styles.buttonText}>DELETE</Text>
          </TouchableOpacity>
          {showBACTrackingChart && <BACTrackingChart />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Additional styles for the buttons
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#81D4FA', // A stylish light blue shade
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow effect
  },
  buttonText: {
    color: '#0277BD', // A darker blue for text to ensure good readability
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default BACCharts;

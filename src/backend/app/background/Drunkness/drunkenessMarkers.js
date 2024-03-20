import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BACMarkers = ({ maxBAC }) => {
  const bacLabels = [
    { label: 'Sober', bacLevel: 0.01 },
    { label: 'Buzzed', bacLevel: 0.03 },
    { label: 'Relaxed', bacLevel: 0.10 },
    { label: 'A Bit of a liability', bacLevel: 0.15 },
    { label: 'Visibly Drunk', bacLevel: 0.20 },
    { label: 'Embarassing', bacLevel: 0.25 },
    { label: 'Sickly', bacLevel: 0.30 },
    { label: 'Either pull or go home', bacLevel: 0.35 },
    { label: 'Find a friend', bacLevel: 0.40 },
    { label: 'Gonna Pass out', bacLevel: 0.45 },
    { label: 'Call and Ambulance', bacLevel: 0.50 },
    { label: 'Critical', bacLevel: 0.55 } // Add "Critical" marker
  ];

  // Calculate the y-axis position for the "Critical" marker
  const criticalYPosition = (0.55 / maxBAC) * 100;

  return (
    <View style={styles.container}>
      {bacLabels.map(({ label, bacLevel }) => (
        <View key={label} style={styles.marker}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.bacLevel}>{bacLevel}</Text>
        </View>
      ))}
      {/* Render "Critical" marker */}
      <View style={[styles.marker, { bottom: `${criticalYPosition}%` }]}>
        <Text style={styles.label}>Critical</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 5
  },
  marker: {
    alignItems: 'center',
    position: 'absolute',
    right: 0
  },
  label: {
    fontSize: 12,
    color: '#000'
  },
  bacLevel: {
    fontSize: 10,
    color: '#999'
  }
});

export default BACMarkers;

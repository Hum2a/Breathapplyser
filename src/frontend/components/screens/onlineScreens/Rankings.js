// RankingsScreen.js - Adjustments for top row alignment
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import GradientButton from '../../buttons/OnlineComponents/GradientButton';
import { BackButton } from '../../buttons/backButton';

const RankingsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <BackButton />
        <Text style={styles.title}>Rankings</Text>
      <View style={styles.buttonRow}>
        <GradientButton
          title="Spent"
          onPress={() => navigation.navigate('SpentRankings')}
        />
        <GradientButton
          title="Drunk"
          onPress={() => navigation.navigate('DrunkRankings')}
        />
        <GradientButton
          title="Most Drank"
          onPress={() => navigation.navigate('MostDrankRankings')}
        />
        <GradientButton
          title="Units"
          onPress={() => navigation.navigate('UnitsRankings')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(190,233,205)',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 20, // Adjust padding to position the row at the top
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#005f73', // Darker blue for text contrast
    textAlign: 'center',
  },
});

export default RankingsScreen;

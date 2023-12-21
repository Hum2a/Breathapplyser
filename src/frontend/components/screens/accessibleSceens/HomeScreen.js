import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { loadDataFromFile, clearEntries, globalData, deleteAllData } from '../../../utils/database';
import { homeStyles } from '../../styles/styles';
import CombinedChart from '../../charts/CombinedChart';

const HomeScreen = ({ navigation }) => {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    loadDataFromFile();
    setChartData([...globalData.chartData, { date: '', units: 0, BACIncrease: globalData.globalBAC }]);
  }, []);
  
  const handleStartDrinking = () => {
    navigation.navigate('StartDrinking');
  };

  const handleAddEntry = () => {
    navigation.navigate('AddEntry');
  };

  const handleViewEntries = () => {
    navigation.navigate('ViewEntries');
  };

  const handleClearEntries = () => {
    clearEntries();
  };

  const handleHistory = () => {
    navigation.navigate('History');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleDelete = () => {
    deleteAllData();
  };
  handleViewCharts = () => {
    navigation.navigate('Charts');
  }

  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.title}>Breathapplyser</Text>

      {/* Chart */}
      {chartData.length > 1 ? (
        <CombinedChart style={homeStyles.chart} />
      ) : (
        <Text>No data</Text>
      )}

      {/* Buttons */}
      <View style={homeStyles.buttonRow}>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleStartDrinking}>
          <Text style={homeStyles.buttonText}>Start Drinking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleAddEntry}>
          <Text style={homeStyles.buttonText}>Add Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleViewEntries}>
          <Text style={homeStyles.buttonText}>View Entries</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleViewCharts}>
          <Text style={homeStyles.buttonText}>View Charts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleClearEntries}>
          <Text style={homeStyles.buttonText}>Clear Entries</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleDelete}>
          <Text style={homeStyles.buttonText}>Delete it All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleHistory}>
          <Text style={homeStyles.buttonText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleProfile}>
          <Text style={homeStyles.buttonText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleSettings}>
          <Text style={homeStyles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

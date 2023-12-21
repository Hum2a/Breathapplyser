import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { UserContext } from '../../../context/UserContext';
import { getServerBaseUrl } from '../../../utils/config/dbURL';
import AllCharts from '../../charts/IndividualCharts';

const ChartsScreen = () => {
  const [chartData, setChartData] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      fetchChartData();
    }
  }, [user]);

  const fetchChartData = async () => {
    try {
      const apiUrl = `${getServerBaseUrl()}/api/chartdata/${user.id}`; // Assuming API to fetch chart data by user ID
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch chart data');
      }
      const fetchedChartData = await response.json();
      setChartData(fetchedChartData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  if (!chartData.length) {
    return <Text>Loading chart data...</Text>;
  }

  return (
    <ScrollView>
      <View>
        <AllCharts chartData={chartData} />
      </View>
    </ScrollView>
  );
};

export default ChartsScreen;

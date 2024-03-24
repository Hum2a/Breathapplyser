import React, { useContext, useEffect, useState } from 'react';
import { View, Dimensions, Text, ScrollView } from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { getFirestore, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import moment from 'moment';
import { UserContext } from '../../../../context/UserContext';
import { visualHistoryStyles as styles } from '../../../styles/HistoryStyles/visualHistoryStyles';

const screenWidth = Dimensions.get('window').width;
const chartHeight = 180; // Adjusted height for a better fit
const pieChartHeight = 90;

const chartConfig = {
  backgroundGradientFrom: "#bbdefb",
  backgroundGradientTo: "#90caf9",
  color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

const VisualDetailedHistory = ({ route }) => {
  const { date } = route.params;
  const [data, setData] = useState(null);
  const firestore = getFirestore();
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchData();
  }, [date]); // Removed user, firestore from dependencies to prevent unnecessary calls

  const fetchData = async () => {
    const path = `${user.uid}/Alcohol Stuff/Entries/${date}/EntryDocs`;
    const startOfDay = moment(date, 'YYYY-MM-DD').startOf('day').toDate();
    const endOfDay = moment(date, 'YYYY-MM-DD').endOf('day').toDate();
    
    const q = query(
      collection(firestore, path),
      where("date", ">=", Timestamp.fromDate(startOfDay)),
      where("date", "<=", Timestamp.fromDate(endOfDay))
    );

    const querySnapshot = await getDocs(q);
    const fetchedData = { drinksByType: {}, drinksByName: {}, unitsOverTime: [], spentOverTime: [] };

    querySnapshot.forEach((doc) => {
      const { type, alcohol, units, price, timestamp } = doc.data();
      fetchedData.drinksByType[type] = (fetchedData.drinksByType[type] || 0) + 1;
      fetchedData.drinksByName[alcohol] = (fetchedData.drinksByName[alcohol] || 0) + 1;
      fetchedData.unitsOverTime.push({ timestamp: timestamp.toDate(), units });
      fetchedData.spentOverTime.push({ timestamp: timestamp.toDate(), price });
    });

    setData(processData(fetchedData));
  };

  const processData = (fetchedData) => {
    // Accumulate units and spent data over time
    let accumulatedUnits = 0;
    let accumulatedSpent = 0;

    const unitsOverTime = fetchedData.unitsOverTime
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(entry => {
        accumulatedUnits += entry.units;
        return { timestamp: entry.timestamp, value: accumulatedUnits };
      });

    const spentOverTime = fetchedData.spentOverTime
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(entry => {
        accumulatedSpent += entry.price;
        return { timestamp: entry.timestamp, value: accumulatedSpent };
      });

    return { ...fetchedData, unitsOverTime, spentOverTime };
  };

  const renderPieChart = (data, title) => (
    <>
      <Text style={styles.chartTitle}>{title}</Text>
      <PieChart
        data={data}
        width={screenWidth}
        height={pieChartHeight}
        chartConfig={chartConfig}
        accessor={"count"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[0, 0]}
        absolute
        style={styles.chart}
      />
    </>
  );

  const renderLineChart = (data, title) => (
    <>
      <Text style={styles.chartTitle}>{title}</Text>
      <LineChart
        data={data}
        width={screenWidth}
        height={chartHeight}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </>
  );

  if (!data) return <Text>Loading...</Text>;

  const { drinksByType, drinksByName, unitsOverTime, spentOverTime } = data;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderPieChart(convertToPieChartData(drinksByType), 'Drinks by Type')}
      {renderPieChart(convertToPieChartData(drinksByName), 'Drinks by Name')}
      {unitsOverTime.length > 0 && renderLineChart(prepareLineChartData(unitsOverTime, 'HH:mm'), 'Units Over Time')}
      {spentOverTime.length > 0 && renderLineChart(prepareLineChartData(spentOverTime, 'HH:mm'), 'Amount Spent Over Time')}
    </ScrollView>
  );
};

// Helper function to convert the raw data into the format expected by PieChart
function convertToPieChartData(data) {
  return Object.entries(data).map(([key, value]) => ({
    name: key,
    count: value,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));
}

// Helper function to prepare data for LineChart with accumulated values
function prepareLineChartData(data, format = 'HH:mm') {
  let accumulatedValue = 0;
  return {
    labels: data.map(item => moment(item.timestamp).format(format)),
    datasets: [
      {
        data: data.map(item => {
          accumulatedValue += item.value;
          return accumulatedValue;
        }),
        color: (opacity = 1) => `rgba(3, 169, 244, ${opacity})`, // Example color
        strokeWidth: 2,
      }
    ]
  };
}

export default VisualDetailedHistory;


import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import { cnoStyles } from '../../../styles/StatsStyles/cnoStyles';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import moment from 'moment';

const CompareNightsOutScreen = ({ route }) => {
  const { date1, date2 } = route.params; // Receive the dates from navigation
  const [firstNightData, setFirstNightData] = useState({
    drinkTally: {},
    totalSpent: 0,
    totalUnits: 0,
    totalBACIncrease: 0,
    lineChartData: { labels: [], datasets: [{ data: [] }] },
    unitsChartData: { labels: [], datasets: [{ data: [] }] },
  });

  const [secondNightData, setSecondNightData] = useState({
    drinkTally: {},
    totalSpent: 0,
    totalUnits: 0,
    totalBACIncrease: 0,
    lineChartData: { labels: [], datasets: [{ data: [] }] },
    unitsChartData: { labels: [], datasets: [{ data: [] }] },
  });

  const [isLoadingFirstNight, setIsLoadingFirstNight] = useState(true);
  const [isLoadingSecondNight, setIsLoadingSecondNight] = useState(true);

  const [isCombinedView, setIsCombinedView] = useState(false);

  const firestore = getFirestore();
  const { user } = useContext(UserContext);

  const fetchDataForNight = async (dateStr, setDataFunction, setLoadingFunction) => {
    setLoadingFunction(true); // Start loading
    const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs");
    try {
      const entriesSnapshot = await getDocs(entriesRef);
      const entries = entriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      let tempTotalSpent = 0;
      let tempTotalUnits = 0;
      let tempTotalBACIncrease = 0;
      let tempDrinkTally = {};
      let times = [];
      let amounts = [];
      let cumulativeAmounts = [];
      let cumulativeAmount = 0;
      let cumulativeUnits = 0;
      let cumulativeUnitsData = [];

      entries.forEach(entry => {
        tempTotalSpent += entry.price * entry.amount;
        tempTotalUnits += entry.units;
        tempTotalBACIncrease += entry.BACIncrease;
        cumulativeAmount += entry.price * entry.amount;
        cumulativeUnits += entry.units;

        const entryTime = moment(entry.startTime).format('HH:mm'); // Format time
        times.push(entryTime); // Use formatted start time for x-axis
        cumulativeAmounts.push(cumulativeAmount); // Use cumulative amount for y-axis
        cumulativeUnitsData.push(cumulativeUnits); // Use cumulative units for y-axis

        const drinkType = entry.type;
        tempDrinkTally[drinkType] = (tempDrinkTally[drinkType] || 0) + 1;
      });

      setDataFunction({
        drinkTally: tempDrinkTally,
        totalSpent: tempTotalSpent,
        totalUnits: tempTotalUnits,
        totalBACIncrease: tempTotalBACIncrease,
        lineChartData: {
          labels: times,
          datasets: [{ data: cumulativeAmounts }],
        },
        unitsChartData: {
          labels: times,
          datasets: [{ data: cumulativeUnitsData }],
        },
      });
      setLoadingFunction(false); // Done loading
    } catch (error) {
      console.error("Error fetching data for night: ", dateStr, error);
      setLoadingFunction(false);
    }
  };

  const mergeChartData = (firstData, secondData) => {
    // Assuming both data sets have the same labels
    return {
      labels: firstData.labels,
      datasets: [
        { data: firstData.datasets[0].data, color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})` }, // optional
        { data: secondData.datasets[0].data, color: (opacity = 1) => `rgba(0, 0, 256, ${opacity})` }, // optional
      ],
    };
  };

  useEffect(() => {
    if (user) {
      fetchDataForNight(moment(date1).format('YYYY-MM-DD'), setFirstNightData, setIsLoadingFirstNight);
      fetchDataForNight(moment(date2).format('YYYY-MM-DD'), setSecondNightData, setIsLoadingSecondNight);
    }
  }, [user, date1, date2]);

  // Chart configuration
  const screenWidth = Dimensions.get('window').width;
  const linechartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  // Render the data similarly to CurrentNightOutScreen
  return (
    <ScrollView style={cnoStyles.container}>
      <View style={cnoStyles.switchContainer}>
        <Text style={cnoStyles.switchLabel}>Combined View:</Text>
        <Switch
          value={isCombinedView}
          onValueChange={(newValue) => setIsCombinedView(newValue)}
        />
      </View>

      {isCombinedView ? (
        // Render combined view
        <View style={cnoStyles.statContainer}>
        <View>
          <Text style={cnoStyles.title}>Night Comparison</Text>
    
          <View style={cnoStyles.subHeaderContainer}>
            <Text style={cnoStyles.subHeaderText}>{moment(date1).format('LL')}</Text>
            <Text style={cnoStyles.subHeaderText}>{moment(date2).format('LL')}</Text>
          </View>
    
          <View style={cnoStyles.dataRow}>
            <Text style={cnoStyles.dataText}>{Object.values(firstNightData.drinkTally).reduce((sum, val) => sum + val, 0)}</Text>
            <Text style={cnoStyles.dataLabel}>Total Drinks</Text>
            <Text style={cnoStyles.dataText}>{Object.values(secondNightData.drinkTally).reduce((sum, val) => sum + val, 0)}</Text>
          </View>
    
          <View style={cnoStyles.dataRow}>
            <Text style={cnoStyles.dataText}>{firstNightData.totalSpent}</Text>
            <Text style={cnoStyles.dataLabel}>Total Spent</Text>
            <Text style={cnoStyles.dataText}>{secondNightData.totalSpent}</Text>
          </View>
    
          <View style={cnoStyles.dataRow}>
            <Text style={cnoStyles.dataText}>{firstNightData.totalUnits}</Text>
            <Text style={cnoStyles.dataLabel}>Total Units</Text>
            <Text style={cnoStyles.dataText}>{secondNightData.totalUnits}</Text>
          </View>
    
          <View style={cnoStyles.dataRow}>
            <Text style={cnoStyles.dataText}>{firstNightData.totalBACIncrease.toFixed(2)}</Text>
            <Text style={cnoStyles.dataLabel}>Total BAC Increase</Text>
            <Text style={cnoStyles.dataText}>{secondNightData.totalBACIncrease.toFixed(2)}</Text>
          </View>
            {!isLoadingFirstNight && !isLoadingSecondNight && (
              <>
                <BarChart
                  // Combine the data for the bar chart
                  data={{
                    labels: Object.keys({ ...firstNightData.drinkTally, ...secondNightData.drinkTally }),
                    datasets: [{
                      data: Object.values({ ...firstNightData.drinkTally, ...secondNightData.drinkTally }),
                    }],
                  }}
                  width={screenWidth}
                  height={220}
                  yAxisLabel=""
                  chartConfig={linechartConfig}
                  verticalLabelRotation={30}
                  fromZero={true}
                  yAxisInterval={1}
                />
                <LineChart
                  // Combine the data for the line chart
                  data={mergeChartData(firstNightData.lineChartData, secondNightData.lineChartData)}
                  width={Dimensions.get('window').width - 16}
                  height={220}
                  chartConfig={linechartConfig}
                  fromZero={true}
                  yAxisInterval={1}
                  bezier
                />
                <LineChart
                data={mergeChartData(firstNightData.unitsChartData, secondNightData.unitsChartData)}
                width={Dimensions.get('window').width - 16}
                height={220}
                chartConfig={linechartConfig}
                fromZero={true}
                yAxisInterval={1}
                bezier
              />
                {/* Legend for the charts */}
                <View style={cnoStyles.legendContainer}>
                  <View style={cnoStyles.legendItem}>
                    <View style={[cnoStyles.legendIndicator, { backgroundColor: 'rgba(134, 65, 244, 1)' }]} />
                    <Text style={cnoStyles.legendText}>{moment(date1).format('LL')}</Text>
                  </View>
                  <View style={cnoStyles.legendItem}>
                    <View style={[cnoStyles.legendIndicator, { backgroundColor: 'rgba(0, 0, 256, 1)' }]} />
                    <Text style={cnoStyles.legendText}>{moment(date2).format('LL')}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      ) : (
        <>
      {/* Render Seperare Views */}
      {/* Render first night's data */}
      <View style={cnoStyles.statContainer}>
        <Text style={cnoStyles.title}>Night 1: {moment(date1).format('LL')}</Text>
        <View>
            <Text style={cnoStyles.statText}>Total Drinks: {Object.values(firstNightData.drinkTally).reduce((sum, val) => sum + val, 0)}</Text>
            <Text style={cnoStyles.statText}>Total Spent: {firstNightData.totalSpent}</Text>
            <Text style={cnoStyles.statText}>Total Units: {firstNightData.totalUnits}</Text>
            <Text style={cnoStyles.statText}>Total BAC Increase: {firstNightData.totalBACIncrease.toFixed(2)}</Text>
            {!isLoadingFirstNight && (
              <>
              <BarChart
                data={{
                    labels: Object.keys(firstNightData.drinkTally),
                    datasets: [{ data: Object.values(firstNightData.drinkTally) }],
                }}
                width={screenWidth}
                height={220}
                yAxisLabel=""
                chartConfig={linechartConfig}
                verticalLabelRotation={30}
                fromZero={true}
                yAxisInterval={1}
              />
              <LineChart
                data={firstNightData.lineChartData}
                width={Dimensions.get('window').width - 16}
                height={220}
                chartConfig={linechartConfig}
                fromZero={true}
                yAxisInterval={1}
                bezier
              />
              <LineChart
                  data={firstNightData.unitsChartData}
                  width={Dimensions.get('window').width - 16}
                  height={220}
                  chartConfig={linechartConfig}
                  fromZero={true}
                  yAxisInterval={1}
                  bezier
                />
            </>
            )}
      </View>
      </View>

      {/* Render second night's data */}
      <View style={cnoStyles.statContainer}>
        <Text style={cnoStyles.title}>Night 2: {moment(date2).format('LL')}</Text>
        <View>
            <Text style={cnoStyles.statText}>Total Drinks: {Object.values(secondNightData.drinkTally).reduce((sum, val) => sum + val, 0)}</Text>
            <Text style={cnoStyles.statText}>Total Spent: {secondNightData.totalSpent}</Text>
            <Text style={cnoStyles.statText}>Total Units: {secondNightData.totalUnits}</Text>
            <Text style={cnoStyles.statText}>Total BAC Increase: {secondNightData.totalBACIncrease.toFixed(2)}</Text>
            {!isLoadingSecondNight && (
              <>
            <BarChart
              data={{
                  labels: Object.keys(secondNightData.drinkTally),
                  datasets: [{ data: Object.values(secondNightData.drinkTally) }],
              }}
              width={screenWidth}
              height={220}
              yAxisLabel=""
              chartConfig={linechartConfig}
              verticalLabelRotation={30}
              fromZero={true}
              yAxisInterval={1}
              />
            <LineChart
              data={secondNightData.lineChartData}
              width={Dimensions.get('window').width - 16}
              height={220}
              chartConfig={linechartConfig}
              fromZero={true}
              yAxisInterval={1}
              bezier
              />
            <LineChart
                  data={secondNightData.unitsChartData}
                  width={Dimensions.get('window').width - 16}
                  height={220}
                  chartConfig={linechartConfig}
                  fromZero={true}
                  yAxisInterval={1}
                  bezier
                />
            </>
            )}
      </View>
      </View>
      </>
      )}
    </ScrollView>
  );
};

export default CompareNightsOutScreen;

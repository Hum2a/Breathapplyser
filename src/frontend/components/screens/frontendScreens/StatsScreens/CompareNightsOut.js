import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Modal, Button, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import { cnoStyles, flatListStyles } from '../../../styles/StatsStyles/cnoStyles';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CompareNightsOutScreen = ({ route }) => {
  const { date1: initialDate1, date2: initialDate2 } = route.params;
  const [date1, setDate1] = useState(initialDate1);
  const [date2, setDate2] = useState(initialDate2);
  const [availableDates, setAvailableDates] = useState([]);
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

  const [isDate1ModalVisible, setDate1ModalVisible] = useState(false);
  const [isDate2ModalVisible, setDate2ModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize selectedDate as a Date object
  const [selectedDateField, setSelectedDateField] = useState(null); // To store which date field is currently being edited


  const firestore = getFirestore();
  const { user } = useContext(UserContext);

  const CACHE_KEY_PREFIX = 'nightData_';

  useEffect(() => {
    const fetchAvailableDates = async () => {
      const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries");
      try {
        const snapshot = await getDocs(entriesRef);
        const dates = snapshot.docs.map(doc => doc.id); // assuming the doc.id is the date
        setAvailableDates(dates);
      } catch (error) {
        console.error("Error fetching available dates: ", error);
      }
    };

    fetchAvailableDates();
  }, [user]);

  const renderDateItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleDatePress(item, selectedDateField)}>
        <Text>{moment(item, 'YYYY MM DD').format('LL')}</Text>
      </TouchableOpacity>
    );
  };

  const fetchDataForNight = async (dateStr, setDataFunction, setLoadingFunction) => {
    setLoadingFunction(true); // Start loading
    const cacheKey = `${CACHE_KEY_PREFIX}${dateStr}`;
    
    try {
      // Check if cache exists and is not older than 24 hours
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        const { nightData, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setDataFunction(nightData);
          setLoadingFunction(false);
          return;
        }
      }
  
      const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs");
      const entriesSnapshot = await getDocs(entriesRef);
      const entries = entriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      // Process fetched data
      let tempTotalSpent = 0;
      let tempTotalUnits = 0;
      let tempTotalBACIncrease = 0;
      let tempDrinkTally = {};
      let times = [];
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
  
        const entryTime = moment(entry.startTime).format('HH:mm');
        times.push(entryTime);
        cumulativeAmounts.push(cumulativeAmount);
        cumulativeUnitsData.push(cumulativeUnits);
  
        const drinkType = entry.type;
        tempDrinkTally[drinkType] = (tempDrinkTally[drinkType] || 0) + 1;
      });
  
      const nightData = {
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
      };
  
      setDataFunction(nightData);
      setLoadingFunction(false);
  
      // Cache the data
      const dataToCache = { nightData, timestamp: Date.now() };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(dataToCache));
    } catch (error) {
      console.error("Error fetching or caching data for night: ", dateStr, error);
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

  const handleDateSelect = (selectedDate, dateField) => {
    if (dateField === 'date1') {
      setDate1(selectedDate);
    } else if (dateField === 'date2') {
      setDate2(selectedDate);
    }
    hideModals();
  };
  
  // Function to show the modal for selecting date1
  const showDate1Modal = () => {
    setDate1ModalVisible(true);
    setSelectedDate(date1);
    setSelectedDateField('date1');
  };
  
  // Function to show the modal for selecting date2
  const showDate2Modal = () => {
    setDate2ModalVisible(true);
    setSelectedDate(date2);
    setSelectedDateField('date2');
  };

  // Function to hide both modals
  const hideModals = () => {
    setDate1ModalVisible(false);
    setDate2ModalVisible(false);
  };



  // Chart configuration
  const screenWidth = Dimensions.get('window').width;
  const linechartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#01BCC2', // Light blue
    backgroundGradientTo: '#B2DFEE', // Lighter shade of blue
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
            <TouchableOpacity onPress={showDate1Modal}>
              <Text style={cnoStyles.subHeaderText}>{moment(date1).format('LL')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={showDate2Modal}>
              <Text style={cnoStyles.subHeaderText}>{moment(date2).format('LL')}</Text>
            </TouchableOpacity>
          </View>

          <Modal visible={isDate1ModalVisible} animationType="slide">
            <View style={cnoStyles.modalContainer}>
              <ScrollView>
              <FlatList
                style={flatListStyles.container}
                data={availableDates}
                renderItem={({ item }) => (
                  <TouchableOpacity style={cnoStyles.modalItemContainer} onPress={() => handleDateSelect(item, 'date1')}>
                    <Text style={cnoStyles.modalItemText}>{moment(item, 'YYYY MM DD').format('LL')}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              </ScrollView>
              <TouchableOpacity
                      style={cnoStyles.closeButton}
                      onPress={() => setDate1ModalVisible(false)}
                      >
                      <Text style={cnoStyles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
          </Modal>

          <Modal visible={isDate2ModalVisible} animationType="slide">
            <View style={cnoStyles.modalItemContainer}>
              <ScrollView>
              <FlatList
                data={availableDates}
                renderItem={({ item }) => (
                  <TouchableOpacity style={cnoStyles.modalItemContainer} onPress={() => handleDateSelect(item, 'date2')}>
                    <Text style={cnoStyles.modalItemText}>{moment(item, 'YYYY MM DD').format('LL')}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              </ScrollView>
              <TouchableOpacity
                      style={cnoStyles.closeButton}
                      onPress={() => setDate2ModalVisible(false)}
                      >
                      <Text style={cnoStyles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
          </Modal>


    
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
        <TouchableOpacity onPress={showDate1Modal}>
          <Text style={cnoStyles.title}>Night 1: {moment(date1).format('LL')}</Text>
        </TouchableOpacity>

        <Modal visible={isDate1ModalVisible} animationType="slide">
            <View style={cnoStyles.modalContainer}>
              <ScrollView>
              <FlatList
                style={flatListStyles.container}
                data={availableDates}
                renderItem={({ item }) => (
                  <TouchableOpacity style={cnoStyles.modalItemContainer} onPress={() => handleDateSelect(item, 'date1')}>
                    <Text style={cnoStyles.modalItemText}>{moment(item, 'YYYY MM DD').format('LL')}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              </ScrollView>
              <TouchableOpacity
                style={cnoStyles.closeButton}
                onPress={() => setDate1ModalVisible(false)}
                >
                <Text style={cnoStyles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>

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
        <TouchableOpacity onPress={showDate2Modal}>
          <Text style={cnoStyles.title}>Night 2: {moment(date2).format('LL')}</Text>
        </TouchableOpacity>

        
          <Modal visible={isDate2ModalVisible} animationType="slide">
            <View style={cnoStyles.modalContainer}>
              <ScrollView>
              <FlatList
                style={flatListStyles.container}
                data={availableDates}
                renderItem={({ item }) => (
                  <TouchableOpacity style={cnoStyles.modalItemContainer} onPress={() => handleDateSelect(item, 'date2')}>
                    <Text style={cnoStyles.modalItemText}>{moment(item, 'YYYY MM DD').format('LL')}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              </ScrollView>
              <TouchableOpacity
                style={cnoStyles.closeButton}
                onPress={() => setDate2ModalVisible(false)}
                >
                <Text style={cnoStyles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>

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

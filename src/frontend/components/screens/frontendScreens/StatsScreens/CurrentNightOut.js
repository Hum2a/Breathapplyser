import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import { cnoStyles } from '../../../styles/StatsStyles/cnoStyles';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const CurrentNightOutScreen = ({ route, navigation }) => {
  const currentDateString = new Date().toISOString().split('T')[0]; // Format current date as 'YYYY-MM-DD'
  const passedDate = route.params?.date; // Optionally passed date from navigation
  const [selectedDateStr, setSelectedDateStr] = useState(passedDate || currentDateString);
  const [drinkTally, setDrinkTally] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const [totalBACIncrease, setTotalBACIncrease] = useState(0);
  const [spendingLimit, setSpendingLimit] = useState(0);
  const [unitLimit, setUnitLimit] = useState(0);
  const [currentBACLevel, setCurrentBACLevel] = useState(0);
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [unitsChartData, setUnitsChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  // const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [isComparing, setIsComparing] = useState(false);
  const firestore = getFirestore();
  const { user } = useContext(UserContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    // Update selected date when the screen is focused
    if (isFocused) {
      setSelectedDateStr(passedDate || currentDateString);
    }
  }, [isFocused, passedDate, currentDateString]);

  const fetchAvailableDates = async () => {
    const CACHE_KEY = 'availableDates';
    try {
      // Check if cache exists and is not older than 24 hours
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { dates, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setAvailableDates(dates);
          return;
        }
      }
  
      // Fetch data from Firestore
      const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries");
      const snapshot = await getDocs(entriesRef);
      const dates = snapshot.docs.map(doc => doc.id);
      setAvailableDates(dates);
  
      // Cache the data
      const dataToCache = { dates, timestamp: Date.now() };
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
    } catch (error) {
      console.error("Error fetching or caching available dates: ", error);
    }
  };

  const renderDateItem = ({ item }) => {
    return (
        <TouchableOpacity
            onPress={() => {
                setModalVisible(false);
                if (isComparing) {
                    // Navigate to CompareNights screen with both dates
                    navigation.navigate('CompareNights', { date1: selectedDateStr, date2: item });
                } else {
                    // Just viewing another night
                    setSelectedDateStr(item);
                }
            }}
            style={cnoStyles.modalItemContainer}
        >
            <Text style={cnoStyles.modalItemText}>{moment(item).format('LL')}</Text>
        </TouchableOpacity>
    );
};

  const handleClick = () => {
    fetchAvailableDates();
    setIsComparing(false); // Not comparing, just viewing another night
    setModalVisible(true);
};

  const handleCalendar = () => {
    navigation.navigate('NightOutCalendar')
  }

  const handleCompareClick = () => {
      fetchAvailableDates();
      setIsComparing(true); // We are comparing nights
      setModalVisible(true);
  };

  useEffect(() => {
    const fetchData = async () => {
        const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", selectedDateStr, "EntryDocs");
        const bacLevelRef = doc(firestore, user.uid, "Daily Totals", "BAC Level", selectedDateStr);
        const limitsRef = doc(firestore, user.uid, "Limits");

      try {
        // Fetch entries
        const entriesSnapshot = await getDocs(entriesRef);
        const entries = entriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort entries by startTime
        entries.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

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
            cumulativeAmount += entry.price * entry.amount;
            cumulativeUnits += entry.units;
            tempTotalBACIncrease += entry.BACIncrease;

          // Prepare data for line chart
            const entryTime = moment(entry.startTime).format('HH:mm'); // Format time
            times.push(entryTime); // Use formatted start time for x-axis
            cumulativeAmounts.push(cumulativeAmount); // Use cumulative amount for y-axis
            cumulativeUnitsData.push(cumulativeUnits);


          // Tally drinks
          const drinkType = entry.type;
          if (tempDrinkTally[drinkType]) {
            tempDrinkTally[drinkType] += 1;
          } else {
            tempDrinkTally[drinkType] = 1;
          }
        });

        console.log('Times:', times);
        console.log('Cumulative Amounts:', cumulativeAmounts);

        setTotalSpent(tempTotalSpent);
        setTotalUnits(tempTotalUnits);
        setTotalBACIncrease(tempTotalBACIncrease);
        setDrinkTally(tempDrinkTally);
        setLineChartData({
            labels: times,
            datasets: [{ data: cumulativeAmounts }],
          });
        setUnitsChartData({
            labels: times,
            datasets: [{ data: cumulativeUnitsData }],
          });

        console.log('Line Chart Data:', { labels: times, datasets: [{ data: cumulativeAmounts }] }); // Log line chart data
          

        // Fetch limits
        const limitsSnapshot = await getDoc(limitsRef);
        if (limitsSnapshot.exists()) {
          const limitsData = limitsSnapshot.data();
          setSpendingLimit(limitsData.spendingLimit);
          setUnitLimit(limitsData.drinkingLimit);
        }

        const bacLevelSnapshot = await getDoc(bacLevelRef);
        if (bacLevelSnapshot.exists()) {
          setCurrentBACLevel(bacLevelSnapshot.data().value);
        } else {
          setCurrentBACLevel(0);
        }

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, selectedDateStr]); // Depend on user and dateStr to refetch data when they change

  const baseChartConfig = {
    backgroundColor: '#92DDFE', // Light blue background
    backgroundGradientFrom: '#92DDFE',
    backgroundGradientTo: '#92DDFE',
    decimalPlaces: 2, // Number of decimal places on values
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White for contrast
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White labels for clarity
    style: {
      borderRadius: 8,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#FFFFFF', // White for dot borders
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // Solid background lines for a clean look
      strokeWidth: 1,
      stroke: '#B0E0E6', // Powder blue for subtle grid lines
    },
    propsForLabels: {
      fontSize: 12, // Adequate size for readability
    }
  };

  const barChartConfig = {
    ...baseChartConfig,
    barPercentage: 0.6, // Slightly wider bars for better visibility
    barRadius: 4,       // Rounded corners for bars
    fillShadowGradient: '#5DADE2', // Gradient start - darker shade of light blue
    fillShadowGradientTo: '#3498DB', // Gradient end - deep sky blue
    fillShadowGradientOpacity: 1,
  };

  const lineChartConfig = {
    ...baseChartConfig,
    bezier: true, // Enable bezier curves for smoother lines
    fillShadowGradient: '#5DADE2', // Start of gradient - cornflower blue
    fillShadowGradientOpacity: 0.5, // Light opacity for a subtle underfill
    fillShadowGradientTo: '#3498DB', // End of gradient - deep sky blue
  };


    
    const screenWidth = Dimensions.get('window').width;
    const containerPadding = 16; // Assuming there's a 16px padding on both sides
    const chartWidth = screenWidth - (containerPadding * 4); 
    const drinkTypes = Object.keys(drinkTally);
    const drinkCounts = Object.values(drinkTally);
    
    const data = {
        labels: drinkTypes,
        datasets: [{
        data: drinkCounts
        }]
    };


  return (
    <ScrollView style={cnoStyles.container}>
      <Text style={cnoStyles.title}>
        Night Out Summary 
          <TouchableOpacity onPress={handleCalendar}>
            <Text style={cnoStyles.dateText}> 
              {selectedDateStr} 
            </Text>
        </TouchableOpacity>
      </Text>
      
      <View style={cnoStyles.statContainer}>
        <Text style={cnoStyles.statText}><Text style={{fontWeight: 'bold'}}>Total Drinks:</Text> {Object.values(drinkTally).reduce((sum, val) => sum + val, 0)}</Text>
        {Object.entries(drinkTally).map(([type, count]) => (
          <Text key={type} style={cnoStyles.statText}>{type}: {count}</Text>
        ))}
      </View>
      
      <View style={cnoStyles.statContainer}>
        <Text style={cnoStyles.statText}><Text style={{fontWeight: 'bold'}}>Total Spent:</Text> {totalSpent}</Text>
        <Text style={cnoStyles.limitText}>Spending Limit: {spendingLimit}</Text>
        <Text style={cnoStyles.statText}><Text style={{fontWeight: 'bold'}}>Total Units:</Text> {totalUnits}</Text>
        <Text style={cnoStyles.limitText}> Limit: {unitLimit}</Text>
      </View>
  
      <View style={cnoStyles.statContainer}>
        <Text style={cnoStyles.bacText}>Current BAC Level: {currentBACLevel.toFixed(2)}</Text>
        <Text style={cnoStyles.bacText}>Total BAC Increase: {totalBACIncrease.toFixed(2)}</Text>
      </View>
      
      <View style={cnoStyles.barChartContainer}>
        <Text style={cnoStyles.chartTitle}>Drinks Tally</Text>
        <BarChart
            data={data}
            width={chartWidth}
            height={220}
            yAxisLabel=""
            chartConfig={barChartConfig}
            verticalLabelRotation={0}
            fromZero={true}
            yAxisInterval={1} 

            />
      </View>

      {lineChartData.labels.length > 0 && lineChartData.datasets[0].data.length > 0 && (
        <View style={cnoStyles.linechartContainer}>
          <Text style={cnoStyles.chartTitle}>Cumulative Amount Spent Over Time</Text>
          <LineChart
            data={lineChartData}
            width={chartWidth}
            height={220}
            chartConfig={lineChartConfig}
            fromZero={true}
            yAxisInterval={1} 
            bezier
          />
        </View>
      )}

      {/* Cumulative Units Line Chart */}
      {unitsChartData.labels.length > 0 && unitsChartData.datasets[0].data.length > 0 && (
        <View style={cnoStyles.linechartContainer}>
          <Text style={cnoStyles.chartTitle}>Cumulative Units Over Time</Text>
          <LineChart
            data={unitsChartData}
            width={chartWidth}
            height={220}
            chartConfig={lineChartConfig}
            fromZero={true}
            yAxisInterval={1} 
            bezier
          />
        </View>
      )}
         <TouchableOpacity
            onPress={handleClick}
            style={cnoStyles.button}
        >
            <Text style={cnoStyles.buttonText}>Select Another Night</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={handleCompareClick}
            style={cnoStyles.button}
        >
            <Text style={cnoStyles.buttonText}>Compare Nights Out</Text>
        </TouchableOpacity>


        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
            setModalVisible(!modalVisible);
            }}
        >
            <View style={cnoStyles.centeredView}>
              <View style={cnoStyles.modalView}>
                <FlatList
                    data={availableDates}
                    renderItem={renderDateItem}
                    keyExtractor={item => item}
                    />
                    <TouchableOpacity
                      style={cnoStyles.closeButton}
                      onPress={() => setModalVisible(!modalVisible)}
                      >
                      <Text style={cnoStyles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
              </View>
            </View>
        </Modal>
    </ScrollView>
  );
   }

export default CurrentNightOutScreen;

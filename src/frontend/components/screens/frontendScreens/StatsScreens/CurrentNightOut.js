import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import { cnoStyles } from '../../../styles/StatsStyles/cnoStyles';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import moment from 'moment';

const CurrentNightOutScreen = ({ navigation }) => {
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
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [isComparing, setIsComparing] = useState(false);
  const firestore = getFirestore();
  const { user } = useContext(UserContext);
  const dateStr = new Date().toISOString().split('T')[0]; // Format the date as 'YYYY-MM-DD'

  const fetchAvailableDates = async () => {
    const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries");
    try {
      const snapshot = await getDocs(entriesRef);
      const dates = snapshot.docs.map(doc => doc.id); // assuming the doc.id is the date
      setAvailableDates(dates);
      console.log(dates); // Log the dates for now
    } catch (error) {
      console.error("Error fetching available dates: ", error);
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
            style={cnoStyles.dateItem}
        >
            <Text style={cnoStyles.dateItemText}>{moment(item).format('LL')}</Text>
        </TouchableOpacity>
    );
};

  

  const handleClick = () => {
    fetchAvailableDates();
    setIsComparing(false); // Not comparing, just viewing another night
    setModalVisible(true);
};

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

    //Bar Chart
    const barchartConfig = {
        backgroundGradientFrom: '#1E2923',
        backgroundGradientTo: '#08130D',
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        barPercentage: 0.5,
    };
    
    const screenWidth = Dimensions.get('window').width;
    const drinkTypes = Object.keys(drinkTally);
    const drinkCounts = Object.values(drinkTally);
    
    const data = {
        labels: drinkTypes,
        datasets: [{
        data: drinkCounts
        }]
    };

    // Line Chart
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


  return (
    <ScrollView style={cnoStyles.container}>
      <Text style={cnoStyles.title}>Night Out Summary</Text>
      
      <View style={cnoStyles.statContainer}>
        <Text style={cnoStyles.statText}>Total Drinks: {Object.values(drinkTally).reduce((sum, val) => sum + val, 0)}</Text>
        {Object.entries(drinkTally).map(([type, count]) => (
          <Text key={type} style={cnoStyles.statText}>{type}: {count}</Text>
        ))}
      </View>
      
      <View style={cnoStyles.statContainer}>
        <Text style={cnoStyles.statText}>Total Spent: {totalSpent}</Text>
        <Text style={cnoStyles.limitText}>Spending Limit: {spendingLimit}</Text>
        <Text style={cnoStyles.statText}>Total Units: {totalUnits}</Text>
        <Text style={cnoStyles.limitText}>Unit Limit: {unitLimit}</Text>
      </View>
  
      <View style={cnoStyles.statContainer}>
        <Text style={cnoStyles.bacText}>Current BAC Level: {currentBACLevel.toFixed(2)}</Text>
        <Text style={cnoStyles.bacText}>Total BAC Increase: {totalBACIncrease.toFixed(2)}</Text>
      </View>
      
      <View style={cnoStyles.barChartContainer}>
        <Text style={cnoStyles.chartTitle}>Drinks Tally</Text>
        <BarChart
            data={data}
            width={screenWidth}
            height={220}
            yAxisLabel=""
            chartConfig={barchartConfig}
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
            width={Dimensions.get('window').width - 16}
            height={220}
            chartConfig={linechartConfig}
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
            width={Dimensions.get('window').width - 16}
            height={220}
            chartConfig={linechartConfig}
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
                style={[cnoStyles.button, cnoStyles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
                >
                <Text style={cnoStyles.textStyle}>Close</Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>
    </ScrollView>
  );
   }

export default CurrentNightOutScreen;

import React, { useEffect, useState, useContext } from 'react';
import { View, Dimensions, Button, StyleSheet, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import { UserContext } from '../../../../context/UserContext';
import { getFirestore, collection, query, getDocs, where } from 'firebase/firestore';
import { bacChartStyles as styles } from '../../../styles/ChartStyles/bacOverTimeStyles';

const BACChart = () => {
  const [bacData, setBacData] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      fetchBACData(user.uid, date);
    }
  }, [date, user]);

  const fetchBACData = async (userId, selectedDate) => {
    const firestore = getFirestore();
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bacLevelRef = collection(firestore, userId, "Alcohol Stuff", "BAC Level");
    const q = query(bacLevelRef, where("lastUpdated", ">=", startOfDay.toISOString()), where("lastUpdated", "<=", endOfDay.toISOString()));

    const querySnapshot = await getDocs(q);
    const dataPoints = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const timestamp = new Date(data.lastUpdated);
      return {
        time: `${timestamp.getHours()}:${timestamp.getMinutes().toString().padStart(2, '0')}`,
        value: data.value,
      };
    });

    const labels = dataPoints.map(dp => dp.time);
    const values = dataPoints.map(dp => dp.value);

    setBacData({
      labels,
      datasets: [{ data: values }]
    });
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      {bacData ? (
        <LineChart
          data={bacData}
          width={Dimensions.get('window').width - 30}
          height={220}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      ) : (
        <Text>Loading BAC data...</Text>
      )}
    </View>
  );
};
export default BACChart;

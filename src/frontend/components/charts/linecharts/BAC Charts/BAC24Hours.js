import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getFirestore, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import moment from 'moment';
import { UserContext } from '../../../../context/UserContext';

const BACGraphLast12Hours = () => {
  const [bacData, setBacData] = useState([]);
  const firestore = getFirestore();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchBACDataLast12Hours = async () => {
      const twelveHoursAgo = moment().subtract(12, 'hours').toDate();
      const now = moment().toDate();

      try {
        const bacRef = collection(firestore, user.uid, "Alcohol Stuff", "BAC Level");
        const q = query(bacRef, where("lastUpdated", ">=", twelveHoursAgo), where("lastUpdated", "<=", now), orderBy("lastUpdated"));
        const querySnapshot = await getDocs(q);
        const fetchedData = [];

        querySnapshot.forEach(doc => {
          const data = doc.data();
          const entry = {
            value: data.currentBAC || data.value,
            lastUpdated: data.lastUpdated.toDate(),
          };
          fetchedData.push(entry);
        });

        setBacData(fetchedData);
      } catch (error) {
        console.error("Error fetching BAC data:", error);
      }
    };

    if (user) {
      fetchBACDataLast12Hours();
    }
  }, [user]);

  // Prepare the data for the graph
  const labels = bacData.map(entry => moment(entry.lastUpdated).format('HH:mm'));
  const dataPoints = bacData.map(entry => entry.value);

  return (
    <View>
      {bacData.length > 0 ? (
        <LineChart
          data={{
            labels,
            datasets: [{ data: dataPoints }]
          }}
          width={Dimensions.get("window").width}
          height={220}
          yAxisLabel=""
          yAxisSuffix=" BAC"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 4,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
        <Text>No BAC data available for the last 12 hours.</Text>
      )}
    </View>
  );
};

export default BACGraphLast12Hours;

import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const BACTrackerScreen = () => {
  const [bacData, setBacData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched

  useEffect(() => {
    // Fetch BAC data from Firestore
    const fetchData = async () => {
      try {
        // Get a reference to Firestore
        const firestore = getFirestore();

        // Replace with the actual collection path where your BAC data is stored
        const bacCollectionRef = collection(firestore, 'YdWRWVpPsJOJxRTercIywJiBkjH2', 'Alcohol Stuff', 'BAC Level');

        // Fetch all documents from the BAC collection
        const querySnapshot = await getDocs(bacCollectionRef);

        // Extract and format the data from the documents
        const data = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            lastUpdated: docData.lastUpdated,
            value: docData.value,
          };
        });

        // Set the fetched data to bacData state and mark data as fetched
        setBacData(data);
        setDataFetched(true);
      } catch (error) {
        console.error('Error fetching BAC data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>BAC Tracker Chart</Text>
      {dataFetched ? (
        <LineChart
          data={{
            labels: bacData.map((data) => data.lastUpdated), // Assuming lastUpdated is the x-axis data
            datasets: [
              {
                data: bacData.map((data) => data.value), // Assuming value is the y-axis data
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Adjust color as needed
              },
            ],
          }}
          width={350}
          height={200}
          yAxisLabel="BAC"
          withInnerLines={false} // Adjust as needed
          chartConfig={{
            backgroundColor: 'white',
            backgroundGradientFrom: 'white',
            backgroundGradientTo: 'white',
            decimalPlaces: 2, // Adjust decimal places as needed
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Line color
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // X and Y axis label color
            style: {
              borderRadius: 16,
            },
          }}
          bezier
        />
      ) : (
        <Text>Loading data...</Text>
      )}
    </View>
  );
};

export default BACTrackerScreen;

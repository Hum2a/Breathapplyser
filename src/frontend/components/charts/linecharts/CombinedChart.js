import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { collection, getFirestore, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import moment from 'moment';
import { UserContext } from '../../../context/UserContext';

const CombinedChart = () => {
  const [bacValues, setBacValues] = useState([]);
  const [drunknessValues, setDrunknessValues] = useState([]);
  const [totalUnitsValues, setTotalUnitsValues] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchAllEntries = async () => {
      try {
        const firestore = getFirestore();
        const userUid = user.uid;

        const entriesSnapshot = await getDocs(collection(firestore, userUid, "Alcohol Stuff", "Entries"));
        const allEntriesData = [];

        for (const doc of entriesSnapshot.docs) {
          const dateStr = doc.id; // dateStr is a string in 'YYYY-MM-DD' format
          const entryDocsRef = collection(firestore, userUid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs");
          const entryDocsSnapshot = await getDocs(entryDocsRef);

          entryDocsSnapshot.forEach((entryDoc) => {
            const entryData = entryDoc.data();
            entryData.date = dateStr; // Use the date string from the document ID
            allEntriesData.push(entryData);
          });
        }

        // Sort all entries by date
        allEntriesData.sort((a, b) => moment(a.date, 'YYYY-MM-DD').diff(moment(b.date, 'YYYY-MM-DD')));

        // Extract relevant data for the chart
        let bac = [], drunkness = [], units = [], labels = [];

        allEntriesData.forEach((entry) => {
          const dateFormatted = moment(entry.date, 'YYYY-MM-DD').format('HH:mm');
          labels.push(dateFormatted);
          bac.push(entry.BACIncrease || 0);
          drunkness.push(entry.drunkness || 0);
          units.push(parseFloat(entry.units) || 0);
        });

        setBacValues(bac);
        setDrunknessValues(drunkness);
        setTotalUnitsValues(units);
        setChartLabels(labels);
      } catch (error) {
        console.error('Error fetching all entries:', error);
      }
    };

    fetchAllEntries();
  }, [user.uid]);

  return (
    <View>
      <LineChart
        data={{
          labels: chartLabels,
          datasets: [
            { data: bacValues, color: () => 'red' }, // Example color
            { data: drunknessValues, color: () => 'blue' },
            { data: totalUnitsValues, color: () => 'green' },
          ]
        }}
        width={300}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          }
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    </View>
  );
};

export default CombinedChart;

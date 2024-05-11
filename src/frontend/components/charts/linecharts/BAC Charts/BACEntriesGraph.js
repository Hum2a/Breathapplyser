import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { collection, getFirestore, query, orderBy, getDocs } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import moment from 'moment';
import { chartConfig } from '../chart-handling/chartConfig';
import { combinedBacStyles as styles } from '../../../styles/ChartStyles/BACCStyles/bacChartsStyles';

const BACIncreaseChart = () => {
    const [BACIncreaseValues, setBACIncreaseValues] = useState([]);
    const [chartLabels, setChartLabels] = useState([]);
    const [allEntries, setAllEntries] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const firestore = getFirestore();
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchAllEntries = async () => {
            const entriesSnapshot = await getDocs(query(collection(firestore, user.uid, "Alcohol Stuff", "Entries")));
            const allEntriesPromises = entriesSnapshot.docs.map(async (doc) => {
                const dateStr = doc.id;
                const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs");
                const entriesSnapshot = await getDocs(entriesRef);
                const entries = entriesSnapshot.docs.map(entryDoc => {
                    const entry = entryDoc.data();
                    entry.date = dateStr; // Add date to entry
                    return entry;
                });
                return entries;
            });
    
            Promise.all(allEntriesPromises).then(entriesArrays => {
                const allEntriesData = entriesArrays.flat();
                // Sort all entries by date in ascending order
                allEntriesData.sort((a, b) => moment(b.date, 'YYYY-MM-DD').diff(moment(a.date, 'YYYY-MM-DD')) ||
                                                moment(a.date, 'HH:mm:ss').diff(moment(b.date, 'HH:mm:ss')));
                setAllEntries(allEntriesData);
                if (allEntriesData.length > 0) {
                    filterDataByDate(allEntriesData, allEntriesData[0].date);
                }
            });
            
        };
    
        fetchAllEntries();
    }, [user.uid, firestore]);
    

    const filterDataByDate = (entries, date) => {
        setSelectedDate(date);
        const filteredEntries = entries.filter(entry => entry.date === date);
        
        // Sort entries by startTime within the selected date
        filteredEntries.sort((a, b) => moment(a.startTime, 'YYYY-MM-DD HH:mm:ss').diff(moment(b.startTime, 'YYYY-MM-DD HH:mm:ss')));
        
        const BACValues = filteredEntries.map(entry => entry.BACIncrease ? parseFloat(entry.BACIncrease) : 0);
        const labels = filteredEntries.map(entry => moment(entry.startTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm') || 'Unknown');
    
        setBACIncreaseValues(BACValues);
        setChartLabels(labels);
    };
    

    const uniqueDates = [...new Set(allEntries.map(entry => entry.date))];

    return (
        <View style={styles.container}>
            <Text style={styles.graphTitle}>BAC Increase Chart</Text>
            <View style={styles.pickersContainer}>
                <Picker
                    selectedValue={selectedDate}
                    onValueChange={(itemValue) => filterDataByDate(allEntries, itemValue)}
                    style={styles.pickerStyle}
                >
                    {uniqueDates.map(date => (
                        <Picker.Item key={date} label={date} value={date} />
                    ))}
                </Picker>
            </View>
            {BACIncreaseValues.length > 0 ? (
                <LineChart
                    data={{
                        labels: chartLabels,
                        datasets: [{ data: BACIncreaseValues, color: () => '#2979FF' }]
                    }}
                    width={350}
                    height={200}
                    chartConfig={{
                        ...chartConfig,
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 4,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: { borderRadius: 16 },
                        withVerticalLabels: true,
                    }}
                    bezier
                    fromZero
                />
            ) : (
                <Text>No data available for this date.</Text>
            )}
        </View>
    );
};

export default BACIncreaseChart;

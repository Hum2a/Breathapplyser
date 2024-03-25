import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { collection, getFirestore, query, orderBy, getDocs } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import moment from 'moment';
import { chartConfig } from '../chart-handling/chartConfig';
import { amountSpentStyles as styles } from '../../../styles/ChartStyles/amountSpentStyles';

const AmountSpentChart = () => {
    const [amountSpentValues, setAmountSpentValues] = useState([]);
    const [chartLabels, setChartLabels] = useState([]);
    const [allEntries, setAllEntries] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [comparisonMode, setComparisonMode] = useState(false);
    const [selectedDate2, setSelectedDate2] = useState('');
    const [amountSpentValues2, setAmountSpentValues2] = useState([]);
    const firestore = getFirestore();
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchAllEntries = async () => {
            try {
                const entriesSnapshot = await getDocs(query(collection(firestore, user.uid, "Alcohol Stuff", "Entries")));
                const allEntriesData = [];
    
                for (const doc of entriesSnapshot.docs) {
                    const dateStr = doc.id; // dateStr is a string in 'YYYY-MM-DD' format
                    const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs");
                    const entriesSnapshot = await getDocs(entriesRef);
    
                    entriesSnapshot.forEach((entryDoc) => {
                        const entry = entryDoc.data();
                        entry.date = dateStr; // Use the date string from the document ID
                        allEntriesData.push(entry);
                    });
                }
    
                // Sort all entries by date in descending order
                allEntriesData.sort((a, b) => moment(b.date, 'YYYY-MM-DD').diff(moment(a.date, 'YYYY-MM-DD')));
                setAllEntries(allEntriesData);
    
                // Automatically set the selected date to the most recent one (the first item in the sorted array)
                if (allEntriesData.length > 0) {
                    filterDataByDate(allEntriesData, allEntriesData[0].date);
                }
            } catch (error) {
                console.error('Error fetching all entries:', error);
            }
        };
    
        fetchAllEntries();
    }, []);
    

    const filterDataByDate = (entries, date, date2 = '') => {
        setSelectedDate(date);
        const filteredEntries = entries.filter(entry => entry.date === date);
        const newValues = [];
        const labels = [];
        let cumulativeSpent = 0;

        // Sort entries within the date by startTime
        filteredEntries.sort((a, b) => moment(a.startTime, 'YYYY-MM-DD HH:mm:ss').diff(moment(b.startTime, 'YYYY-MM-DD HH:mm:ss')));

        filteredEntries.forEach(entry => {
            cumulativeSpent += parseFloat(entry.price || 0);
            newValues.push(cumulativeSpent);

            // Use the startTime as the label
            const timeLabel = entry.startTime ? moment(entry.startTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm') : 'Unknown Time';
            labels.push(timeLabel);
        });

        setAmountSpentValues(newValues);
        setChartLabels(labels);

        // Handle data for the second date if in comparison mode
        if (comparisonMode && date2) {
            setSelectedDate2(date2);
            const filteredEntries2 = entries.filter(entry => entry.date === date2);
            const newValues2 = [];
            const labels2 = [];
            let cumulativeSpent2 = 0;

            // Sort entries within the second date by startTime
            filteredEntries2.sort((a, b) => moment(a.startTime, 'YYYY-MM-DD HH:mm:ss').diff(moment(b.startTime, 'YYYY-MM-DD HH:mm:ss')));

            filteredEntries2.forEach(entry => {
                cumulativeSpent2 += parseFloat(entry.price || 0);
                newValues2.push(cumulativeSpent2);

                // Use the startTime as the label
                const timeLabel = entry.startTime ? moment(entry.startTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm') : 'Unknown Time';
                labels2.push(timeLabel);
            });

            setAmountSpentValues2(newValues2);
        }
    };

    const uniqueDates = [...new Set(allEntries.map(entry => entry.date))];

    return (
        <View style={styles.container}>
            <Text style={styles.graphTitle}>Amount Spent Chart</Text>
            {/* Toggle for Comparison Mode */}
            <Text style={styles.toggleLabel}>Comparison Mode:</Text>
            <Switch
                value={comparisonMode}
                onValueChange={() => {
                    setComparisonMode(!comparisonMode);
                    setAmountSpentValues2([]);
                    setSelectedDate2('');
                }}
            />
             {/* Picker for the first date */}
            <Picker
                selectedValue={selectedDate}
                onValueChange={(itemValue) => filterDataByDate(allEntries, itemValue)}
                style={styles.pickerStyle} // You can define this style in your chartStyles
            >
                {uniqueDates.map(date => (
                    <Picker.Item key={date} label={date} value={date} />
                ))}
            </Picker>
            {/* Picker for the second date (visible in comparison mode) */}
            {comparisonMode && (
                <Picker
                    selectedValue={selectedDate2}
                    onValueChange={(itemValue) => {
                        setSelectedDate2(itemValue);
                        filterDataByDate(allEntries, selectedDate, itemValue);
                    }}
                    style={styles.pickerStyle}
                >
                    {uniqueDates.map(date => (
                        <Picker.Item key={date} label={date} value={date} />
                    ))}
                </Picker>
            )}
           {amountSpentValues.length > 0 ? (
                <View>
                    <LineChart
                        data={{
                            labels: chartLabels,
                            datasets: [
                                { data: amountSpentValues, color: () => '#2979FF' },
                                // Include the second dataset if in comparison mode
                                ...(comparisonMode && amountSpentValues2.length > 0
                                    ? [{ data: amountSpentValues2, color: () => '#FF6D00' }]
                                    : [])
                            ],
                        }}
                        width={350}
                        height={200}
                        chartConfig={{
                            ...chartConfig,
                            backgroundColor: '#ffffff',
                            backgroundGradientFrom: '#ffffff',
                            backgroundGradientTo: '#ffffff',
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: { borderRadius: 16 },
                            withVerticalLabels: true,
                        }}
                        bezier
                        fromZero
                    />
                    <View style={styles.legendContainer}>
                        <View style={[styles.legendItem, { backgroundColor: '#2979FF' }]} />
                        <Text style={styles.legendLabel}>Amount Spent</Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.noDataText}>No data available for this date.</Text> // Style this as needed
            )}
        </View>
    );
}

export default AmountSpentChart;

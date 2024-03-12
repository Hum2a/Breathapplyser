import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { collection, getFirestore, query, orderBy, getDocs } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import moment from 'moment';
import { chartConfig } from '../chart-handling/chartConfig';
import { combinedBacStyles as styles } from '../../../styles/ChartStyles/BACCStyles/bacChartsStyles';

const BACIncreaseChart = () => {
    const [bacIncreaseValues, setBacIncreaseValues] = useState([]);
    const [chartLabels, setChartLabels] = useState([]);
    const [allEntries, setAllEntries] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [comparisonMode, setComparisonMode] = useState(false);
    const [selectedDate2, setSelectedDate2] = useState('');
    const [bacIncreaseValues2, setBacIncreaseValues2] = useState([]);
    const firestore = getFirestore();
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchAllEntries = async () => {
            try {
                const entriesSnapshot = await getDocs(query(collection(firestore, user.uid, "Alcohol Stuff", "Entries")));
                const allEntriesData = [];

                for (const doc of entriesSnapshot.docs) {
                    const dateStr = doc.id;
                    const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs");
                    const entriesSnapshot = await getDocs(entriesRef);

                    entriesSnapshot.forEach((entryDoc) => {
                        const entry = entryDoc.data();
                        entry.date = dateStr;
                        allEntriesData.push(entry);
                    });
                }

                allEntriesData.sort((a, b) => moment(a.date, 'YYYY-MM-DD').diff(moment(b.date, 'YYYY-MM-DD')));
                setAllEntries(allEntriesData);

                filterDataByDate(allEntriesData, allEntriesData[0]?.date);
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
        let cumulativeBACIncrease = 0;

        filteredEntries.sort((a, b) => moment(a.startTime, 'YYYY-MM-DD HH:mm:ss').diff(moment(b.startTime, 'YYYY-MM-DD HH:mm:ss')));

        filteredEntries.forEach(entry => {
            cumulativeBACIncrease += parseFloat(entry.BACIncrease || 0);
            newValues.push(cumulativeBACIncrease);
            const timeLabel = entry.startTime ? moment(entry.startTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm') : 'Unknown Time';
            labels.push(timeLabel);
        });

        setBacIncreaseValues(newValues);
        setChartLabels(labels);

        if (comparisonMode && date2) {
            setSelectedDate2(date2);
            const filteredEntries2 = entries.filter(entry => entry.date === date2);
            const newValues2 = [];
            let cumulativeBACIncrease2 = 0;

            filteredEntries2.forEach(entry => {
                cumulativeBACIncrease2 += parseFloat(entry.bacIncrease || 0);
                newValues2.push(cumulativeBACIncrease2);
            });

            setBacIncreaseValues2(newValues2);
        }
    };

    const uniqueDates = [...new Set(allEntries.map(entry => entry.date))];

    return (
        <View style={styles.container}>
            <Text style={styles.graphTitle}>BAC Cumulative Increase Chart</Text>
            <Switch
                value={comparisonMode}
                onValueChange={() => {
                    setComparisonMode(!comparisonMode);
                    setBacIncreaseValues2([]);
                    setSelectedDate2('');
                }}
            />
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
            {bacIncreaseValues.length > 0 ? (
                <View>
                    <LineChart
                        data={{
                            labels: chartLabels,
                            datasets: [
                                { data: bacIncreaseValues, color: () => '#2979FF' },
                                ...(comparisonMode && bacIncreaseValues2.length > 0
                                    ? [{ data: bacIncreaseValues2, color: () => '#FF6D00' }]
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
                        }}
                        bezier
                        fromZero
                    />
                    <View style={styles.legendContainer}>
                        <View style={[styles.legendItem, { backgroundColor: '#2979FF' }]} />
                        <Text style={styles.legendLabel}>BAC Increase</Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.noDataText}>No data available for this date.</Text>
            )}
        </View>
    );
}

export default BACIncreaseChart;

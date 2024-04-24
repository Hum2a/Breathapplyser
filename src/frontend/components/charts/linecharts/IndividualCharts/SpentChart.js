import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { collection, getFirestore, query, getDocs } from 'firebase/firestore';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../../../context/UserContext';
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
        fetchAllEntries();
    }, []);

    const fetchAllEntries = async (ignoreCache = false) => {
        const cacheKey = `amountSpentData_${user.uid}`;
        if (!ignoreCache) {
            const cachedData = await getCachedData(cacheKey);
            if (cachedData) {
                setAllEntries(cachedData);
                if (cachedData.length > 0) {
                    filterDataByDate(cachedData, cachedData[0].date);
                }
                return;
            }
        }

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

            allEntriesData.sort((a, b) => moment(b.date, 'YYYY-MM-DD').diff(moment(a.date, 'YYYY-MM-DD')));
            setAllEntries(allEntriesData);
            await cacheData(cacheKey, allEntriesData);
            if (allEntriesData.length > 0) {
                filterDataByDate(allEntriesData, allEntriesData[0].date);
            }
        } catch (error) {
            console.error('Error fetching all entries:', error);
        }
    };

    const cacheData = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error caching data:', error);
        }
    };

    const getCachedData = async (key) => {
        try {
            const cachedData = await AsyncStorage.getItem(key);
            return cachedData ? JSON.parse(cachedData) : null;
        } catch (error) {
            console.error('Error retrieving cached data:', error);
            return null;
        }
    };

    const filterDataByDate = (entries, date, date2 = '') => {
        setSelectedDate(date);
        const filteredEntries = entries.filter(entry => entry.date === date);
        const newValues = [];
        const labels = [];
        let cumulativeSpent = 0;

        filteredEntries.sort((a, b) => moment(a.startTime, 'YYYY-MM-DD HH:mm:ss').diff(moment(b.startTime, 'YYYY-MM-DD HH:mm:ss')));

        filteredEntries.forEach(entry => {
            cumulativeSpent += parseFloat(entry.price || 0);
            newValues.push(cumulativeSpent);
            const timeLabel = entry.startTime ? moment(entry.startTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm') : 'Unknown Time';
            labels.push(timeLabel);
        });

        setAmountSpentValues(newValues);
        setChartLabels(labels);

        if (comparisonMode && date2) {
            setSelectedDate2(date2);
            const filteredEntries2 = entries.filter(entry => entry.date === date2);
            const newValues2 = [];
            const labels2 = [];
            let cumulativeSpent2 = 0;

            filteredEntries2.sort((a, b) => moment(a.startTime, 'YYYY-MM-DD HH:mm:ss').diff(moment(b.startTime, 'YYYY-MM-DD HH:mm:ss')));

            filteredEntries2.forEach(entry => {
                cumulativeSpent2 += parseFloat(entry.price || 0);
                newValues2.push(cumulativeSpent2);
                const timeLabel = entry.startTime ? moment(entry.startTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm') : 'Unknown Time';
                labels2.push(timeLabel);
            });

            setAmountSpentValues2(newValues2);
        }
    };

    const uniqueDates = [...new Set(allEntries.map(entry => entry.date))];

    const refreshData = () => {
        fetchAllEntries(true);  // Ignore the cache and fetch fresh data
    };

    return (
        <View style={styles.container}>
            <Text style={styles.graphTitle}>Amount Spent Chart</Text>
            <Switch
                value={comparisonMode}
                onValueChange={(toggle) => {
                    setComparisonMode(toggle);
                    setAmountSpentValues2([]);
                    setSelectedDate2('');
                }}
            />
            <Picker
                selectedValue={selectedDate}
                onValueChange={(itemValue) => filterDataByDate(allEntries, itemValue)}
                style={styles.pickerStyle}
            >
                {uniqueDates.map(date => (
                    <Picker.Item key={date} label={date} value={date} />
                ))}
            </Picker>
            {amountSpentValues.length > 0 && (
                <LineChart
                    data={{
                        labels: chartLabels,
                        datasets: [
                            { data: amountSpentValues, color: () => '#2979FF' },
                            ...(comparisonMode && amountSpentValues2.length > 0 ? [{ data: amountSpentValues2, color: () => '#FF6D00' }] : [])
                        ],
                    }}
                    width={Dimensions.get('window').width - 16}
                    height={220}
                    chartConfig={{
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
            )}
            <TouchableOpacity onPress={() => fetchAllEntries(true)} style={styles.refreshButton}>
                <Image
                    source={require('../../../../assets/images/refresh-icon.png')}
                    style={styles.updateButtonImage} 
                />
            </TouchableOpacity>
        </View>
    );
};

export default AmountSpentChart;

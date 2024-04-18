import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PieChart } from 'react-native-chart-kit';
import { collection, getFirestore, query, orderBy, getDocs } from 'firebase/firestore';
import { UserContext } from '../../../context/UserContext';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NameStyles as styles } from '../../styles/ChartStyles/nameStyles';
import { chartConfig } from '../charthandling/pieChartConfig';

const DrinkNamesChart = () => {
    const [drinkNamesData, setDrinkNamesData] = useState([]);
    const [chartLabels, setChartLabels] = useState([]);
    const [allEntries, setAllEntries] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [comparisonMode, setComparisonMode] = useState(false);
    const [selectedDate2, setSelectedDate2] = useState('');
    const [drinkNamesData2, setDrinkNamesData2] = useState([]);
    const firestore = getFirestore();
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchAllEntries = async () => {
            try {
                const cachedData = await AsyncStorage.getItem('drinkNamesChartData');
                if (cachedData) {
                    const parsedData = JSON.parse(cachedData);
                    setAllEntries(parsedData.allEntries);
                    setDrinkNamesData(parsedData.drinkNamesData);
                    // Attempt to set the picker to today's date, or to the most recent date available
                    const todayFormatted = moment().format('YYYY-MM-DD');
                    const mostRecentAvailableDate = parsedData.allEntries.find(entry => entry.date <= todayFormatted)?.date || parsedData.allEntries[0]?.date;
                    setSelectedDate(mostRecentAvailableDate);
                } else {
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
    
                    // Set selectedDate to today if exists in allEntriesData, otherwise to the most recent date
                    const today = moment().format('YYYY-MM-DD');
                    const mostRecentDate = allEntriesData.find(entry => entry.date <= today)?.date || allEntriesData[0]?.date;
                    setSelectedDate(mostRecentDate);
    
                    // Compute drink names data
                    const drinkNamesCount = {};
                    allEntriesData.forEach(entry => {
                        const drinkName = entry.alcohol;
                        drinkNamesCount[drinkName] = (drinkNamesCount[drinkName] || 0) + 1;
                    });
                    const drinkNamesChartData = Object.entries(drinkNamesCount);
                    setDrinkNamesData(drinkNamesChartData);
    
                    // Cache fetched data
                    const dataToCache = {
                        allEntries: allEntriesData,
                        drinkNamesData: drinkNamesChartData,
                    };
                    await AsyncStorage.setItem('drinkNamesChartData', JSON.stringify(dataToCache));
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
        const drinkNamesCount = {};

        filteredEntries.forEach(entry => {
            const drinkName = entry.alcohol;
            drinkNamesCount[drinkName] = (drinkNamesCount[drinkName] || 0) + 1;
        });

        setDrinkNamesData(Object.entries(drinkNamesCount));

        // Handle data for the second date if in comparison mode
        if (comparisonMode && date2) {
            setSelectedDate2(date2);
            const filteredEntries2 = entries.filter(entry => entry.date === date2);
            const drinkNamesCount2 = {};

            filteredEntries2.forEach(entry => {
                const drinkName = entry.alcohol;
                drinkNamesCount2[drinkName] = (drinkNamesCount2[drinkName] || 0) + 1;
            });

            setDrinkNamesData2(Object.entries(drinkNamesCount2));
        }
    };

    const uniqueDates = [...new Set(allEntries.map(entry => entry.date))];

    const pieChartData = drinkNamesData.map(([name, count]) => ({
    name: name,
    count: count,
    color: '#' + Math.floor(Math.random()*16777215).toString(16), // Assign a random color
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
}));

    return (
        <View style={styles.container}>
            <Text style={styles.graphTitle}>Drink Names Chart</Text>
            <View style={styles.switchContainer}>
                <Text style={styles.toggleLabel}>Comparison Mode:</Text>
                <Switch
                    value={comparisonMode}
                    onValueChange={() => {
                        setComparisonMode(!comparisonMode);
                        // Reset the second pie chart data when toggling off comparison mode
                        if (!comparisonMode) {
                            setDrinkNamesData2([]);
                            setSelectedDate2('');
                        }
                    }}
                />
            </View>
            <Picker
                selectedValue={selectedDate || moment().format('YYYY-MM-DD')}
                onValueChange={(itemValue) => filterDataByDate(allEntries, itemValue, selectedDate)}
                style={styles.pickerStyle}
            >
                {uniqueDates.map(date => (
                    <Picker.Item key={date} label={date} value={date} />
                ))}
            </Picker>
            {comparisonMode && (
                <Picker
                    selectedValue={selectedDate2}
                    onValueChange={(itemValue) => {
                        setSelectedDate2(itemValue);
                        filterDataByDate(allEntries, selectedDate2, itemValue);
                    }}
                    style={styles.pickerStyle}
                >
                    {uniqueDates.filter(date => date !== selectedDate).map(date => (
                        <Picker.Item key={date} label={date} value={date} />
                    ))}
                </Picker>
            )}
            {drinkNamesData.length > 0 && (
                <PieChart
                    data={drinkNamesData.map(([name, count]) => ({
                        name,
                        count,
                        color: '#' + Math.floor(Math.random()*16777215).toString(16),
                        legendFontColor: "#7F7F7F",
                        legendFontSize: 15
                    }))}
                    width={Dimensions.get('window').width - 16} // Adjust for padding
                    height={220}
                    chartConfig={chartConfig}
                    accessor={"count"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    center={[10, 10]}
                    absolute
                    style={styles.chart}
                />
            )}
            {comparisonMode && drinkNamesData2.length > 0 && (
                <PieChart
                    data={drinkNamesData2.map(([name, count]) => ({
                        name,
                        count,
                        color: '#' + Math.floor(Math.random()*16777215).toString(16),
                        legendFontColor: "#7F7F7F",
                        legendFontSize: 15
                    }))}
                    width={Dimensions.get('window').width - 16} // Adjust for padding
                    height={220}
                    chartConfig={chartConfig}
                    accessor={"count"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    center={[10, 10]}
                    absolute
                    style={styles.chart}
                />
            )}
            {drinkNamesData.length === 0 && (
                <Text style={styles.noDataText}>No data available for this date.</Text>
            )}
        </View>
    );

};

export default DrinkNamesChart;

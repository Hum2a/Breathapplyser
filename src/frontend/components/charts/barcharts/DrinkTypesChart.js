import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BarChart } from 'react-native-chart-kit';
import { collection, getFirestore, query, orderBy, getDocs } from 'firebase/firestore';
import moment from 'moment';
import { chartConfig } from '../linecharts/chart-handling/chartConfig';
import { NameStyles as styles } from '../../styles/ChartStyles/nameStyles';
import { UserContext } from '../../../context/UserContext';

const DrinkTypeChart = () => {
    const [drinkTypesData, setDrinkTypesData] = useState([]);
    const [chartLabels, setChartLabels] = useState([]);
    const [allEntries, setAllEntries] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [comparisonMode, setComparisonMode] = useState(false);
    const [selectedDate2, setSelectedDate2] = useState('');
    const [drinkTypesData2, setDrinkTypesData2] = useState([]);
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

                // Sort all entries by date
                allEntriesData.sort((a, b) => moment(a.date, 'YYYY-MM-DD').diff(moment(b.date, 'YYYY-MM-DD')));
                setAllEntries(allEntriesData);

                // Set initial chart data based on the first date
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
        const drinkTypesCount = {};

        filteredEntries.forEach(entry => {
            const drinkType = entry.type;
            drinkTypesCount[drinkType] = (drinkTypesCount[drinkType] || 0) + 1;
        });

        setDrinkTypesData(Object.entries(drinkTypesCount));

        // Handle data for the second date if in comparison mode
        if (comparisonMode && date2) {
            setSelectedDate2(date2);
            const filteredEntries2 = entries.filter(entry => entry.date === date2);
            const drinkTypesCount2 = {};

            filteredEntries2.forEach(entry => {
                const drinkType = entry.type;
                drinkTypesCount2[drinkType] = (drinkTypesCount2[drinkType] || 0) + 1;
            });

            setDrinkTypesData2(Object.entries(drinkTypesCount2));
        }
    };

    const uniqueDates = [...new Set(allEntries.map(entry => entry.date))];

    return (
        <View style={styles.container}>
            <Text style={styles.graphTitle}>Drink Types Chart</Text>
            {/* Toggle for Comparison Mode */}
            <Text style={styles.toggleLabel}>Comparison Mode:</Text>
            <Switch
                value={comparisonMode}
                onValueChange={() => {
                    setComparisonMode(!comparisonMode);
                    setDrinkTypesData2([]);
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
           {drinkTypesData.length > 0 ? (
                <View>
                    <BarChart
                        data={{
                            labels: drinkTypesData.map(([drinkType, count]) => drinkType),
                            datasets: [
                                { data: drinkTypesData.map(([drinkType, count]) => count), color: () => '#2979FF' },
                                // Include the second dataset if in comparison mode
                                ...(comparisonMode && drinkTypesData2.length > 0
                                    ? [{ data: drinkTypesData2.map(([drinkType, count]) => count), color: () => '#FF6D00' }]
                                    : [])
                            ],
                        }}
                        width={Dimensions.get('window').width}
                        height={220}
                        yAxisLabel=""
                        chartConfig={{
                            backgroundColor: '#EF4723',
                            backgroundGradientFrom: '#EF4723',
                            backgroundGradientTo: '#D94D14',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                            borderRadius: 16,
                            },
                            yAxisMinValue: 0, // Set minimum y-axis value to 0
                        }}
                        fromZero={true} // Ensure y-axis starts from 0
                        yAxisInterval={1}
                        verticalLabelRotation={10}
                    />
                    <View style={styles.legendContainer}>
                        <View style={[styles.legendItem, { backgroundColor: '#2979FF' }]} />
                        <Text style={styles.legendLabel}>Drink Types</Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.noDataText}>No data available for this date.</Text> // Style this as needed
            )}
        </View>
    );
}

export default DrinkTypeChart;

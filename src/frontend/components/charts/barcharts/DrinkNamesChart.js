import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BarChart } from 'react-native-chart-kit';
import { collection, getFirestore, query, orderBy, getDocs } from 'firebase/firestore';
import { UserContext } from '../../../context/UserContext';
import moment from 'moment';
import { chartConfig } from '../linecharts/chart-handling/chartConfig';
import { NameStyles as styles } from '../../styles/ChartStyles/nameStyles';

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
    const updatedChartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#BAEAFF',
        backgroundGradientTo: '#E7F2F8',
        decimalPlaces: 0, // consider if you want decimals or not
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Text color
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color for consistency
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: '6', // Radius of the dot
          strokeWidth: '2',
          stroke: '#007AFF', // Theme consistent blue
        },
        barPercentage: 0.5,
        barRadius: 4, // Rounded bar edges for aesthetics
        fillShadowGradient: '#007AFF', // Gradient color for bars
        fillShadowGradientOpacity: 1, // Gradient opacity
      };

    return (
        <View style={styles.container}>
            <Text style={styles.graphTitle}>Drink Names Chart</Text>
            {/* Toggle for Comparison Mode */}
            <Text style={styles.toggleLabel}>Comparison Mode:</Text>
            <Switch
                value={comparisonMode}
                onValueChange={() => {
                    setComparisonMode(!comparisonMode);
                    setDrinkNamesData2([]);
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
           {drinkNamesData.length > 0 ? (
                <View>
                    <BarChart
                        data={{
                            labels: drinkNamesData.map(([drinkName, count]) => drinkName),
                            datasets: [
                                { data: drinkNamesData.map(([drinkName, count]) => count), color: () => '#2979FF' },
                                // Include the second dataset if in comparison mode
                                ...(comparisonMode && drinkNamesData2.length > 0
                                    ? [{ data: drinkNamesData2.map(([drinkName, count]) => count), color: () => '#FF6D00' }]
                                    : [])
                            ],
                        }}
                        width={Dimensions.get('window').width}
                        height={220}
                        yAxisLabel=""
                        chartConfig={updatedChartConfig}
                        fromZero={true} // Ensure y-axis starts from 0
                        yAxisInterval={1}
                        verticalLabelRotation={10}
                    />
                    <View style={styles.legendContainer}>
                        <View style={[styles.legendItem, { backgroundColor: '#2979FF' }]} />
                        <Text style={styles.legendLabel}>Drink Names</Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.noDataText}>No data available for this date.</Text> // Style this as needed
            )}
        </View>
    );
}

export default DrinkNamesChart;

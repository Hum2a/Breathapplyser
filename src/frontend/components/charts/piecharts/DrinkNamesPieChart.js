import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PieChart } from 'react-native-chart-kit';
import { collection, getFirestore, query, orderBy, getDocs } from 'firebase/firestore';
import { UserContext } from '../../../context/UserContext';
import moment from 'moment';
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
                <PieChart
                    data={pieChartData}
                    width={Dimensions.get('window').width} // Adjust according to your layout
                    height={220}
                    chartConfig={chartConfig}
                    accessor={"count"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    center={[10, 10]} // Adjust as needed
                    absolute={false}
                />
            ) : (
                <Text style={styles.noDataText}>No data available for this date.</Text>
            )}
        </View>
    );
};

export default DrinkNamesChart;

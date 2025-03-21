import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BarChart } from 'react-native-chart-kit';
import { collection, getFirestore, query, orderBy, getDocs } from 'firebase/firestore';
import moment from 'moment';
import { chartConfig } from '../linecharts/chart-handling/chartConfig';
import { NameStyles as styles } from '../../styles/ChartStyles/nameStyles';
import { UserContext } from '../../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

        fetchAllEntries();
    }, [firestore, user.uid]);

    const fetchAllEntries = async () => {
        try {
            const cacheKey = `drinkTypesData_${user.uid}`;
            const cachedData = await getCachedData(cacheKey);
            
            if (cachedData) {
                setAllEntries(cachedData);
                return;
            }
    
            const entriesSnapshot = await getDocs(query(collection(firestore, user.uid, "Alcohol Stuff", "Entries")));
            let allEntriesData = [];
    
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
    
            allEntriesData.sort((a, b) => moment(b.date).diff(moment(a.date))); // Sort by date descending
            setAllEntries(allEntriesData);
            await cacheData(cacheKey, allEntriesData); // Cache the fetched data
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
             <View style={styles.pickersContainer}>
                <Picker
                    selectedValue={selectedDate}
                    onValueChange={(itemValue) => filterDataByDate(allEntries, itemValue)}
                    style={styles.pickerStyle} // You can define this style in your chartStyles
                >
                    {uniqueDates.map(date => (
                        <Picker.Item key={date} label={date} value={date} />
                    ))}
                </Picker>
            </View>
            {/* Picker for the second date (visible in comparison mode) */}
            {comparisonMode && (
                <View style={styles.pickersContainer}>
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
                </View>
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
                        chartConfig={updatedChartConfig}
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
            <TouchableOpacity onPress={() => fetchAllEntries(true)} style={styles.refreshButton}>
                <Image
                    source={require('../../../assets/images/refresh-icon.png')}
                    style={styles.updateButtonImage} 
                />
            </TouchableOpacity>
        </View>
    );
}

export default DrinkTypeChart;

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Dimensions, ScrollView, Switch, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PieChart } from 'react-native-chart-kit';
import { collection, getFirestore, query, orderBy, getDocs } from 'firebase/firestore';
import moment from 'moment';
import { NameStyles as styles } from '../../styles/ChartStyles/nameStyles';
import { UserContext } from '../../../context/UserContext';
import { chartConfig } from '../charthandling/pieChartConfig';
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
        if (user) {
            fetchAllEntries();
        }
    }, [user.uid]); // Dependency on user.uid ensures data is refetched if the user changes
    

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

    // const chartConfig = {
    //     backgroundColor: '#ffffff',
    //     backgroundGradientFrom: '#BAEAFF',
    //     backgroundGradientTo: '#E7F2F8',
    //     decimalPlaces: 0, // optional, defaults to 2dp
    //     color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`, // function returning a color with opacity
    //     labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // optional
    //     style: {
    //         borderRadius: 16,
    //     },
    //     propsForDots: {
    //         r: '6',
    //         strokeWidth: '2',
    //         stroke: '#ffa726',
    //     },
    //     };
      

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.graphTitle}>Drink Types Chart</Text>
            <View style={styles.switchContainer}>
                <Text style={styles.toggleLabel}>Comparison Mode:</Text>
                <Switch
                    value={comparisonMode}
                    onValueChange={() => {
                        setComparisonMode(!comparisonMode);
                        // Reset second date data when toggling off comparison mode
                        if (!comparisonMode) {
                            setSelectedDate2('');
                            setDrinkTypesData2([]);
                        }
                    }}
                />
            </View>
            <View style={styles.pickersContainer}>
                <Picker
                    selectedValue={selectedDate}
                    onValueChange={(itemValue) => filterDataByDate(allEntries, itemValue, selectedDate)}
                    style={styles.pickerStyle}
                >
                    {uniqueDates.map(date => (
                        <Picker.Item key={date} label={date} value={date} />
                    ))}
                </Picker>
            </View>
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
                        {uniqueDates.filter(date => date !== selectedDate).map(date => (
                            <Picker.Item key={date} label={date} value={date} />
                        ))}
                    </Picker>
                </View>
            )}
            {drinkTypesData.length > 0 && (
                <PieChart
                    data={drinkTypesData.map(([drinkType, count]) => ({
                        name: drinkType,
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
            {comparisonMode && drinkTypesData2.length > 0 && (
                <PieChart
                    data={drinkTypesData2.map(([drinkType, count]) => ({
                        name: drinkType,
                        count,
                        color: '#' + Math.floor(Math.random()*16777215).toString(16),
                        legendFontColor: "#7F7F7F",
                        legendFontSize: 15,
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
            {drinkTypesData.length === 0 && (
                <Text style={styles.noDataText}>No data available for this date.</Text>
            )}
            <TouchableOpacity onPress={() => fetchAllEntries(true)} style={styles.refreshButton}>
                <Image
                    source={require('../../../assets/images/refresh-icon.png')}
                    style={styles.updateButtonImage} 
                />
            </TouchableOpacity>
        </ScrollView>
    );
    
};

export default DrinkTypeChart;

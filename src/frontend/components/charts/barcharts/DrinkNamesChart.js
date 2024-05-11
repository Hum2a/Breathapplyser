import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BarChart } from 'react-native-chart-kit';
import { collection, getFirestore, query, getDocs } from 'firebase/firestore';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../../context/UserContext';
import { NameStyles as styles } from '../../styles/ChartStyles/nameStyles';
import { chartConfig } from '../charthandling/ChartConfig';

const DrinkNamesChart = () => {
    const [drinkNamesData, setDrinkNamesData] = useState([]);
    const [allEntries, setAllEntries] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [comparisonMode, setComparisonMode] = useState(false);
    const [selectedDate2, setSelectedDate2] = useState('');
    const [drinkNamesData2, setDrinkNamesData2] = useState([]);
    const firestore = getFirestore();
    const { user } = useContext(UserContext);

    useEffect(() => {
        fetchAllEntries();
    }, [firestore, user.uid]);

    const fetchAllEntries = async (ignoreCache = false) => {
        const cacheKey = `drinkNamesData_${user.uid}`;
        if (!ignoreCache) {
            const cachedData = await getCachedData(cacheKey);
            if (cachedData) {
                setAllEntries(cachedData);
                filterDataByDate(cachedData, moment().format('YYYY-MM-DD'));
                return;
            }
        }

        try {
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

            allEntriesData.sort((a, b) => moment(b.date).diff(moment(a.date)));
            setAllEntries(allEntriesData);
            await cacheData(cacheKey, allEntriesData);
            filterDataByDate(allEntriesData, moment().format('YYYY-MM-DD'));
        } catch (error) {
            console.error('Error fetching all entries:', error);
        }
    };

    const refreshData = () => {
        fetchAllEntries(true); // Pass true to ignore cache
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
        const drinkNamesCount = {};

        filteredEntries.forEach(entry => {
            const drinkName = entry.alcohol;
            drinkNamesCount[drinkName] = (drinkNamesCount[drinkName] || 0) + 1;
        });

        setDrinkNamesData(Object.entries(drinkNamesCount).map(([name, count]) => ({ name, count })));

        if (comparisonMode && date2) {
            setSelectedDate2(date2);
            const filteredEntries2 = entries.filter(entry => entry.date === date2);
            const drinkNamesCount2 = {};

            filteredEntries2.forEach(entry => {
                const drinkName = entry.alcohol;
                drinkNamesCount2[drinkName] = (drinkNamesCount2[drinkName] || 0) + 1;
            });

            setDrinkNamesData2(Object.entries(drinkNamesCount2).map(([name, count]) => ({ name, count })));
        }
    };

    const uniqueDates = [...new Set(allEntries.map(entry => entry.date))];

    const isDataLoaded = drinkNamesData.length > 0; // Check if data is ready

    return (
        <View style={styles.container}>
            <Text style={styles.graphTitle}>Drink Names Frequency Chart</Text>
            <Switch
                value={comparisonMode}
                onValueChange={(toggle) => {
                    setComparisonMode(toggle);
                    setDrinkNamesData2([]);
                    setSelectedDate2('');
                }}
            />
            {isDataLoaded && (
                <>
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
                    <BarChart
                        data={{
                            labels: drinkNamesData.map(data => data.name),
                            datasets: [
                                {
                                    data: drinkNamesData.map(data => data.count),
                                }
                            ],
                        }}
                        width={Dimensions.get('window').width - 16}
                        height={220}
                        chartConfig={{
                            backgroundColor: '#ffffff',
                            backgroundGradientFrom: '#BAEAFF',
                            backgroundGradientTo: '#E7F2F8',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        verticalLabelRotation={30}
                        fromZero
                    />
                </>
            )}
            {!isDataLoaded && (
                <Text>Loading data...</Text>
            )}
            <TouchableOpacity onPress={() => fetchAllEntries(true)} style={styles.refreshButton}>
                <Image
                    source={require('../../../assets/images/refresh-icon.png')}
                    style={styles.updateButtonImage} 
                />
            </TouchableOpacity>
        </View>
    );
};

export default DrinkNamesChart;

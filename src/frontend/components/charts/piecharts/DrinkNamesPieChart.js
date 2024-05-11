import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PieChart } from 'react-native-chart-kit';
import { collection, getFirestore, query, getDocs } from 'firebase/firestore';
import moment from 'moment';
import { NameStyles as styles } from '../../styles/ChartStyles/nameStyles';
import { chartConfig } from '../charthandling/pieChartConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../../context/UserContext';

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

        setDrinkNamesData(Object.entries(drinkNamesCount));

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

    return (
        <View style={styles.container}>
            <Text style={styles.graphTitle}>Drink Names Chart</Text>
            <Switch
                value={comparisonMode}
                onValueChange={() => {
                    setComparisonMode(!comparisonMode);
                    setDrinkNamesData2([]);
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
            <PieChart
                data={drinkNamesData.map(([name, count]) => ({
                    name,
                    count,
                    color: '#' + Math.floor(Math.random()*16777215).toString(16),
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15
                }))}
                width={Dimensions.get('window').width - 16}
                height={220}
                chartConfig={chartConfig}
                accessor={"count"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[10, 10]}
                absolute
            />
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

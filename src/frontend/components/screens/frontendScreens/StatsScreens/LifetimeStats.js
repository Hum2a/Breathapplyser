import React, { useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { getFirestore, collection, getDocs, query, orderBy, doc } from 'firebase/firestore';
import { auth } from '../../../../../backend/firebase/database/firebase';
import moment from 'moment';
import { UserContext } from '../../../../context/UserContext';
import { lifetimeStyles as styles } from '../../../styles/StatsStyles/lifetimeStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackButton } from '../../../buttons/backButton';

const LifetimeStats = () => {
    const [dayRange, setDayRange] = useState(10); // Now managed by state
    const [totalUnits, setTotalUnits] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [expanded, setExpanded ] = useState({});
    const [drinkTypeDetails, setDrinkTypeDetails] = useState({});
    const [showDetailedUnits, setShowDetailedUnits] = useState(false);
    const [detailedUnitsData, setDetailedUnitsData] = useState([]);
    const [showDetailedSpent, setShowDetailedSpent] = useState(false);
    const [detailedSpentData, setDetailedSpentData] = useState([]);
    const [accountCreationDate, setAccountCreationDate] = useState(null);

    const { user } = useContext(UserContext);
    const firestore = getFirestore();

    useEffect(() => {
        if (user) {
            fetchLifetimeStats();
            fetchTotalUnitsAndAmountSpent();
            fetchDetailedData(); // Make sure to call this function
        }
    }, [user, dayRange]);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            // Firebase returns the creation time as a string, so we use moment to parse it
            const creationTime = moment(user.metadata.creationTime);
            setAccountCreationDate(creationTime);
        }
    }, []);
    

    const fetchLifetimeStats = async (forceRefresh = false) => {
        const cacheKey = `lifetimeStats_${dayRange}`; // Include dayRange in the cache key
        if (!forceRefresh) {
            const cachedData = await AsyncStorage.getItem(cacheKey);
            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                const cacheTime = moment(parsedData.timestamp);
                if (moment().diff(cacheTime, 'days') < 1) { // Check if the cache is less than a day old
                    console.log('Using cached data for dayRange:', dayRange);
                    setDrinkTypeDetails(parsedData.data);
                    setExpanded(Object.keys(parsedData.data).reduce((acc, key) => ({ ...acc, [key]: false }), {}));
                    return;
                }
            }
        }
    
        if (!user) return;
    
        let currentDate = moment();
        const endDate = moment().subtract(dayRange, 'days');
        let typeData = {};
    
        while (currentDate.isAfter(endDate)) {
            const dateStr = currentDate.format('YYYY-MM-DD');
            const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs");
            const querySnapshot = await getDocs(entriesRef);
    
            querySnapshot.forEach(doc => {
                const { type, alcohol, units = 1, price = 0 } = doc.data();
                if (!typeData[type]) {
                    typeData[type] = { totalUnits: 0, totalSpent: 0, totalCount: 0, names: {} };
                }
                typeData[type].totalUnits += units;
                typeData[type].totalSpent += price;
                typeData[type].totalCount += 1;
    
                if (!typeData[type].names[alcohol]) {
                    typeData[type].names[alcohol] = { totalCount: 1, units, price };
                } else {
                    typeData[type].names[alcohol].totalCount += 1;
                    typeData[type].names[alcohol].units += units;
                    typeData[type].names[alcohol].price += price;
                }
            });
    
            currentDate.subtract(1, 'days');
        }
    
        setDrinkTypeDetails(typeData);
        await AsyncStorage.setItem(cacheKey, JSON.stringify({ timestamp: moment().toISOString(), data: typeData }));
        setExpanded(Object.keys(typeData).reduce((acc, key) => ({ ...acc, [key]: false }), {}));
    };
    
    
    const fetchTotalUnitsAndAmountSpent = async () => {
        const cacheKey = `totalStats_${dayRange}`;
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            const cacheTime = moment(parsedData.timestamp);
            if (moment().diff(cacheTime, 'days') < 1) {
                setTotalUnits(parsedData.units);
                setTotalSpent(parsedData.spent);
                return;
            }
        }
    
        if (!user) return;
    
        let unitsSum = 0;
        let spentSum = 0;
        let currentDate = moment();
        const endDate = moment().subtract(dayRange, 'days');
    
        while (currentDate.isAfter(endDate)) {
            const dateStr = currentDate.format('YYYY-MM-DD');
            const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs");
            const querySnapshot = await getDocs(entriesRef);
    
            querySnapshot.forEach(doc => {
                const { units = 1, price = 0 } = doc.data();
                unitsSum += units;
                spentSum += price;
            });
    
            currentDate.subtract(1, 'days');
        }
    
        setTotalUnits(unitsSum);
        setTotalSpent(spentSum);
        await AsyncStorage.setItem(cacheKey, JSON.stringify({ timestamp: moment().toISOString(), units: unitsSum, spent: spentSum }));
    };
    
    const fetchDetailedData = async () => {
        const cacheKey = `detailedStats_${dayRange}`;
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            const cacheTime = moment(parsedData.timestamp);
            if (moment().diff(cacheTime, 'days') < 1) {
                setDetailedUnitsData(parsedData.units);
                setDetailedSpentData(parsedData.spent);
                return;
            }
        }
    
        if (!user) return;
    
        let unitsByDate = {};
        let spentByDate = {};
        let currentDate = moment();
        const endDate = moment().subtract(dayRange, 'days');
    
        while (currentDate.isAfter(endDate)) {
            const dateStr = currentDate.format('YYYY-MM-DD');
            const entriesRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", dateStr, "EntryDocs");
            const querySnapshot = await getDocs(entriesRef);
    
            let dailyUnits = 0;
            let dailySpent = 0;
            querySnapshot.forEach(doc => {
                const data = doc.data();
                dailyUnits += data.units || 0;
                dailySpent += data.price || 0;
            });
    
            if (dailyUnits > 0) unitsByDate[dateStr] = dailyUnits;
            if (dailySpent > 0) spentByDate[dateStr] = dailySpent;
    
            currentDate.subtract(1, 'days');
        }
    
        const detailedUnitsData = Object.entries(unitsByDate).map(([date, units]) => ({ date, units })).sort((a, b) => b.units - a.units);
        const detailedSpentData = Object.entries(spentByDate).map(([date, spent]) => ({ date, spent })).sort((a, b) => b.spent - a.spent);
    
        setDetailedUnitsData(detailedUnitsData.slice(0, 10));
        setDetailedSpentData(detailedSpentData.slice(0, 10));
        await AsyncStorage.setItem(cacheKey, JSON.stringify({ timestamp: moment().toISOString(), units: detailedUnitsData, spent: detailedSpentData }));
    };
    
    const handleAllTime = () => {
        const user = auth.currentUser;
        if (user) {
            const creationTime = moment(user.metadata.creationTime);
            const today = moment();
            const daysSinceCreation = today.diff(creationTime, 'days');
            setDayRange(daysSinceCreation);
        }
    };
    
    
    const toggleExpand = (type) => {
        setExpanded(prev => ({ ...prev, [type]: !prev[type] }));
    };

    // Handlers to adjust the day range
    const increaseDayRange = () => setDayRange(prev => prev + 10);
    const decreaseDayRange = () => setDayRange(prev => Math.max(10, prev - 10)); // Prevent it going below 10

    const handleRefresh = () => {
        fetchLifetimeStats(true);
        fetchTotalUnitsAndAmountSpent(true);
        fetchDetailedData(true);
    };
    
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <BackButton />
                <Text style={styles.title}>Lifetime Stats</Text>

                <TouchableOpacity style={styles.dayRangeButton} onPress={handleAllTime}>
                    <Text style={styles.dayRangeButtonText}>All Time</Text>
                </TouchableOpacity>

                <View style={styles.dayRangeContainer}>
                    <TouchableOpacity style={styles.dayRangeButton} onPress={decreaseDayRange}>
                        <Text style={styles.dayRangeButtonText}>Decrease Day Range</Text>
                    </TouchableOpacity>

                    <TextInput
                        style={styles.dayRangeInput} // Define this style in your StyleSheet
                        value={String(dayRange)}
                        onChangeText={(text) => setDayRange(Number(text))}
                        keyboardType="numeric"
                        returnKeyType="done"
                    />

                    <TouchableOpacity style={styles.dayRangeButton} onPress={increaseDayRange}>
                        <Text style={styles.dayRangeButtonText}>Increase Day Range</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.headerText}>Drink Type</Text>
                        <Text style={styles.headerText}>Total Count</Text>
                        <Text style={styles.headerText}>Total Units</Text>
                        <Text style={styles.headerText}>Amount Spent</Text>
                    </View>
                    {Object.entries(drinkTypeDetails).map(([type, details]) => (
                        <View key={type}>
                            <TouchableOpacity style={styles.tableRow} onPress={() => toggleExpand(type)}>
                                <Text style={styles.rowText}>{type}</Text>
                                <Text style={styles.rowText}>{details.totalCount}</Text>
                                <Text style={styles.rowText}>{details.totalUnits}</Text>
                                <Text style={styles.rowText}>${details.totalSpent.toFixed(2)}</Text>
                            </TouchableOpacity>
                            {expanded[type] && details.names && (
                                <View style={styles.expandedSection}>
                                    {Object.entries(details.names).map(([name, detail]) => (
                                        <View key={name} style={styles.detailRow}>
                                            <Text style={styles.detailText}>{name}</Text>
                                            <Text style={styles.detailText}>{detail.totalCount}</Text>
                                            <Text style={styles.detailText}>{detail.units}</Text>
                                            <Text style={styles.detailText}>${detail.price.toFixed(2)}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
                {/* Summary of Total Units */}
                <Text style={styles.subtitle}>Total Units Consumed</Text>
                <TouchableOpacity style={styles.summaryTable} onPress={() => setShowDetailedUnits(!showDetailedUnits)}>
                    <Text style={styles.summaryValue}>{totalUnits}</Text>
                    {showDetailedUnits && detailedUnitsData.length > 0 && (
                        <View style={styles.expandedSection}>
                            {detailedUnitsData.map((item, index) => (
                                <View key={index} style={styles.detailRow}>
                                    <Text style={styles.detailText}>{item.date}: {item.units} units</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </TouchableOpacity>
                {/* Summary of Total Amount Spent */}
                <Text style={styles.subtitle}>Total Amount Spent</Text>
                <TouchableOpacity style={styles.summaryTable} onPress={() => setShowDetailedSpent(!showDetailedSpent)}>
                    <Text style={styles.summaryValue}>${totalSpent.toFixed(2)}</Text>
                    {showDetailedSpent && detailedSpentData.length > 0 && (
                        <View style={styles.expandedSection}>
                            {detailedSpentData.map((item, index) => (
                                <View key={index} style={styles.detailRow}>
                                    <Text style={styles.detailText}>{item.date}: ${item.spent.toFixed(2)}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </TouchableOpacity>
                <View style={styles.refreshContainer}>
                    <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                        <Text style={styles.refreshButtonText}>Refresh</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

    
export default LifetimeStats;

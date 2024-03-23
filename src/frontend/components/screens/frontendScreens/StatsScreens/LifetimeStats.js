import React, { useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { getFirestore, collection, getDocs, query, orderBy, doc } from 'firebase/firestore';
import moment from 'moment';
import { UserContext } from '../../../../context/UserContext';
import { lifetimeStyles as styles } from '../../../styles/StatsStyles/lifetimeStyles';

const LifetimeStats = () => {
    const [dayRange, setDayRange] = useState(10); // Now managed by state
    const [totalUnits, setTotalUnits] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [expanded, setExpanded ] = useState({});
    const [drinkTypeDetails, setDrinkTypeDetails] = useState({});
    const { user } = useContext(UserContext);
    const firestore = getFirestore();

    useEffect(() => {
        if (user) {
            fetchLifetimeStats();
            fetchTotalUnitsAndAmountSpent();
        }
    }, [user, dayRange]);

    const fetchLifetimeStats = async () => {
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
    
                // Initialize or update the details for each alcohol name within the type
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
        setExpanded(Object.keys(typeData).reduce((acc, key) => ({ ...acc, [key]: false }), {}));
    };
    

    const fetchTotalUnitsAndAmountSpent = async () => {
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
    };
    

    const toggleExpand = (type) => {
        setExpanded(prev => ({ ...prev, [type]: !prev[type] }));
    };

    // Handlers to adjust the day range
    const increaseDayRange = () => setDayRange(prev => prev + 10);
    const decreaseDayRange = () => setDayRange(prev => Math.max(10, prev - 10)); // Prevent it going below 10
    
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.title}>Lifetime Stats</Text>
                <View style={styles.dayRangeContainer}>
                    <TouchableOpacity style={styles.dayRangeButton} onPress={decreaseDayRange}>
                        <Text style={styles.dayRangeButtonText}>Decrease Day Range</Text>
                    </TouchableOpacity>
                    <Text style={styles.dayRangeText}>Day Range: {dayRange}</Text>
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
                <View style={styles.summaryTable}>
                    <Text style={styles.summaryValue}>{totalUnits}</Text>
                </View>

                {/* Summary of Total Amount Spent */}
                <Text style={styles.subtitle}>Total Amount Spent</Text>
                <View style={styles.summaryTable}>
                    <Text style={styles.summaryValue}>${totalSpent.toFixed(2)}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

    
export default LifetimeStats;

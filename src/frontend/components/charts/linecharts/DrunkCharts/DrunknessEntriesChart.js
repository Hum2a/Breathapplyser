import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { collection, getFirestore, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import moment from 'moment';
import { chartConfig } from '../chart-handling/chartConfig';
import { DrunkStyles as styles } from '../../../styles/ChartStyles/DrunknessStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DrunkennessLevelChart = () => {
    const [bacIncreaseValues, setBacIncreaseValues] = useState([]);
    const [chartLabels, setChartLabels] = useState([]);
    const [allEntries, setAllEntries] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [comparisonMode, setComparisonMode] = useState(false);
    const [selectedDate2, setSelectedDate2] = useState('');
    const [bacIncreaseValues2, setBacIncreaseValues2] = useState([]);
    const [drunkennessLevel, setDrunkenessLevel] = useState([]);
    const [drunkParameters, setDrunkParameters] = useState([]);
    const firestore = getFirestore();
    const { user } = useContext(UserContext);

    useEffect(() => {
        fetchDrunkParameters();
        fetchAllEntries();
    }, [user]); 

    const fetchDrunkParameters = async () => {
        if (user) {
            const parametersRef = doc(firestore, user.uid, 'Drunk Parameters');
            const docSnap = await getDoc(parametersRef);

            if (docSnap.exists()) {
                setDrunkParameters(docSnap.data().levels);
            }
        }
    };


    const fetchAllEntries = async (ignoreCache = false) => {
        const cacheKey = `drunkennessData_${user.uid}`;
        if (!ignoreCache) {
            const cachedData = await getCachedData(cacheKey);
            if (cachedData) {
                setAllEntries(cachedData);
                if (cachedData.length > 0) {
                    filterDataByDate(cachedData, cachedData[0].date);
                }
                return;
            }
        }

        try {
            const entriesSnapshot = await getDocs(query(collection(firestore, user.uid, "Alcohol Stuff", "Entries")));
            const allEntriesData = [];

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

            allEntriesData.sort((a, b) => moment(b.date, 'YYYY-MM-DD').diff(moment(a.date, 'YYYY-MM-DD')));
            setAllEntries(allEntriesData);
            await cacheData(cacheKey, allEntriesData);
            if (allEntriesData.length > 0) {
                filterDataByDate(allEntriesData, allEntriesData[0].date);
            }
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

    const refreshData = () => {
        fetchAllEntries(true);  // Ignore the cache and fetch fresh data
    };
    

    const filterDataByDate = (entries, date, date2 = '') => {
        setSelectedDate(date);
        const filteredEntries = entries.filter(entry => entry.date === date);
        const newValues = [];
        const labels = [];
        const drunknessLevels = {}; // Object to store the time at which each level of drunkness was reached
    
        let cumulativeBACIncrease = 0;
    
        filteredEntries.sort((a, b) => moment(a.startTime, 'YYYY-MM-DD HH:mm:ss').diff(moment(b.startTime, 'YYYY-MM-DD HH:mm:ss')));
    
        filteredEntries.forEach(entry => {
            cumulativeBACIncrease += parseFloat(entry.BACIncrease || 0);
            newValues.push(cumulativeBACIncrease);
            const timeLabel = entry.startTime ? moment(entry.startTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm') : 'Unknown Time';
            labels.push(timeLabel);
    
            const levelInfo = getDrunkennessLevel(cumulativeBACIncrease, drunkParameters);
            const level = levelInfo.simple;
            if (!(level in drunknessLevels)) {
                drunknessLevels[level] = timeLabel;
            }
        });
    
        setBacIncreaseValues(newValues);
        setChartLabels(labels);
    
        if (comparisonMode && date2) {
            setSelectedDate2(date2);
            const filteredEntries2 = entries.filter(entry => entry.date === date2);
            const newValues2 = [];
            let cumulativeBACIncrease2 = 0;
    
            filteredEntries2.forEach(entry => {
                cumulativeBACIncrease2 += parseFloat(entry.bacIncrease || 0);
                newValues2.push(cumulativeBACIncrease2);
            });
    
            setBacIncreaseValues2(newValues2);
        }
    
        console.log('Drunkness Levels:', drunknessLevels); // Print the drunkness levels and their corresponding times
        setDrunkenessLevel(drunknessLevels);
    };

    const getDrunkennessLevel = (bac, parameters) => {
        let levelInfo = { simple: "Unknown", detailed: "No data available." };
        for (const param of parameters) {
            const [min, max] = param.range.split(' - ').map(Number);
            if (bac >= min && bac < max) {
                levelInfo = { simple: param.simple, detailed: param.detailed };
                break;
            }
        }
        return levelInfo;
    };
    

    const uniqueDates = [...new Set(allEntries.map(entry => entry.date))];

    return (
        <View style={styles.container}>
            <Text style={styles.graphTitle}>Drunkness Chart Entries</Text>
            <Switch
                value={comparisonMode}
                onValueChange={() => {
                    setComparisonMode(!comparisonMode);
                    setBacIncreaseValues2([]);
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
            {bacIncreaseValues.length > 0 ? (
                <View>
                    <LineChart
                        data={{
                            labels: chartLabels,
                            datasets: [
                                { data: bacIncreaseValues, color: () => '#2979FF' },
                                ...(comparisonMode && bacIncreaseValues2.length > 0
                                    ? [{ data: bacIncreaseValues2, color: () => '#FF6D00' }]
                                    : [])
                            ],
                        }}
                        width={350}
                        height={200}
                        chartConfig={{
                            ...chartConfig,
                            backgroundColor: '#ffffff',
                            backgroundGradientFrom: '#ffffff',
                            backgroundGradientTo: '#ffffff',
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: { borderRadius: 16 },
                        }}
                        bezier
                        fromZero
                    />
                    <View style={styles.legendContainer}>
                        <View style={[styles.legendItem, { backgroundColor: '#2979FF' }]} />
                        <Text style={styles.legendLabel}>BAC Increase</Text>
                    </View>
                    {Object.entries(drunkennessLevel).map(([level, time]) => (
                        <View key={level} style={styles.drunknessLevelContainer}>
                            <Text style={styles.drunknessLevel}>{level}</Text>
                            <Text style={styles.drunknessTime}>{time}</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <Text style={styles.noDataText}>No data available for this date.</Text>
            )}
            <TouchableOpacity onPress={() => fetchAllEntries(true)} style={styles.refreshButton}>
                <Image
                    source={require('../../../../assets/images/refresh-icon.png')}
                    style={styles.updateButtonImage} 
                />
            </TouchableOpacity>
        </View>
    );
}

export default DrunkennessLevelChart;

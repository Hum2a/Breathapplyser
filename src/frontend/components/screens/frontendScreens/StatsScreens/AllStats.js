import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import { allStatsStyles as styles } from '../../../styles/StatsStyles/allStatsStyles';

const AllStatsScreen = ({ navigation }) => {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Fetch the list of dates from Firestore here
    const fetchDates = async () => {
      const firestore = getFirestore();
      const userUid = user.uid;

      try {
        const datesQuerySnapshot = await getDocs(collection(firestore, userUid, "Daily Totals", "Amount Spent"));
        const dateList = datesQuerySnapshot.docs.map((doc) => doc.id);
        setDates(dateList);
      } catch (error) {
        console.error('Error fetching dates:', error);
      }
    };

    fetchDates();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Statistics</Text>
      <FlatList
        data={dates}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedDate(item)}>
            <View style={styles.dateItem}>
              <Text style={styles.dateText}>{moment(item).format('MMMM D, YYYY')}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {selectedDate && (
        <DetailedStats date={selectedDate} />
      )}
    </View>
  );
};

const DetailedStats = ({ date }) => {
  const [amountSpent, setAmountSpent] = useState(null);
  const [unitIntake, setUnitIntake] = useState(null);
  const [bacLevel, setBACLevel] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Fetch detailed statistics for the selected date here
    const fetchDetailedStats = async () => {
      const firestore = getFirestore();
      const userUid = user.uid; // Replace with the user's UID

      try {
        // Fetch Amount Spent
        const amountSpentRef = doc(firestore, userUid, "Daily Totals", "Amount Spent", date);
        const amountSpentDoc = await getDoc(amountSpentRef);
        const amountSpentData = amountSpentDoc.data()?.value || 0;
        setAmountSpent(amountSpentData);

        // Fetch Unit Intake
        const unitsIntakeRef = doc(firestore, userUid, "Daily Totals", "Unit Intake", date);
        const unitsIntakeDoc = await getDoc(unitsIntakeRef);
        const unitsIntakeData = unitsIntakeDoc.data()?.value || 0;
        setUnitIntake(unitsIntakeData);

        // Fetch BAC Level
        const bacLevelRef = doc(firestore, userUid, "Daily Totals", "BAC Level", date);
        const bacLevelDoc = await getDoc(bacLevelRef);
        const bacLevelData = bacLevelDoc.data()?.value || 0;
        setBACLevel(bacLevelData);
      } catch (error) {
        console.error('Error fetching detailed stats:', error);
      }
    };

    fetchDetailedStats();
  }, [date]);

  return (
    <View style={styles.detailedStatsContainer}>
      <Text style={styles.detailedStatsTitle}>Detailed Statistics for {moment(date).format('MMMM D, YYYY')}</Text>
      {amountSpent !== null && (
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>Amount Spent:</Text>
          <Text style={styles.statValue}>${amountSpent.toFixed(2)}</Text>
        </View>
      )}
      {unitIntake !== null && (
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>Unit Intake:</Text>
          <Text style={styles.statValue}>{unitIntake} units</Text>
        </View>
      )}
      {bacLevel !== null && (
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>BAC Level:</Text>
          <Text style={styles.statValue}>{bacLevel.toFixed(2)}</Text>
        </View>
      )}
    </View>
  );
};


export default AllStatsScreen;

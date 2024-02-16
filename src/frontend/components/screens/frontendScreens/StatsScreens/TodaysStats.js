import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import { TodaysStyles as styles } from '../../../styles/StatsStyles/todaysStatsStyles';

const StatsScreen = ({ navigation }) => {
  const [amountSpent, setAmountSpent] = useState(null);
  const [unitIntake, setUnitIntake] = useState(null);
  const [bacLevel, setBACLevel] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Fetch the data from Firestore here
    const fetchStatsData = async () => {
      const firestore = getFirestore();
      const userUid = user.uid;
      const selectedDateStr = moment().format('YYYY-MM-DD'); // Replace with the desired date

      // Fetch Amount Spent
      const amountSpentRef = doc(firestore, userUid, "Daily Totals", "Amount Spent", selectedDateStr);
      const amountSpentDoc = await getDoc(amountSpentRef);
      const amountSpentData = amountSpentDoc.data()?.value || 0;
      setAmountSpent(amountSpentData);

      // Fetch Unit Intake
      const unitsIntakeRef = doc(firestore, userUid, "Daily Totals", "Unit Intake", selectedDateStr);
      const unitsIntakeDoc = await getDoc(unitsIntakeRef);
      const unitsIntakeData = unitsIntakeDoc.data()?.value || 0;
      setUnitIntake(unitsIntakeData);

      // Fetch BAC Level
      const bacLevelRef = doc(firestore, userUid, "Daily Totals", "BAC Level", selectedDateStr);
      const bacLevelDoc = await getDoc(bacLevelRef);
      const bacLevelData = bacLevelDoc.data()?.value || 0;
      setBACLevel(bacLevelData);

      // Fetch Last Updated Timestamp
      const lastUpdatedTimestamp = amountSpentDoc.updateTime || unitsIntakeDoc.updateTime || bacLevelDoc.updateTime;
      const formattedLastUpdated = moment(lastUpdatedTimestamp).format('MMMM D, YYYY [at] HH:mm:ss');
      setLastUpdated(formattedLastUpdated);
    };

    fetchStatsData();
  }, []);

  // Check if all data is null, if so, don't render the component
  if (amountSpent === null && unitIntake === null && bacLevel === null && lastUpdated === null) {
    return null; // Return null to prevent rendering
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Statistics</Text>
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
      {lastUpdated !== null && (
        <Text style={styles.lastUpdated}>Last Updated: {lastUpdated}</Text>
      )}
    </View>
  );
};

export default StatsScreen;

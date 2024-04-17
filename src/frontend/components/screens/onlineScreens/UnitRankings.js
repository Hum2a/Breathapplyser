import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getFirestore, collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import moment from 'moment';

const UnitsRankings = () => {
  const [rankings, setRankings] = useState([]);
  const firestore = getFirestore();
  const dateStr = moment().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchRankings = async () => {
      const usersRef = collection(firestore, "Users");
      const usersSnapshot = await getDocs(query(usersRef));
      
      // Fetch the unit intake for each user and include it in the rankings
      const usersData = await Promise.all(usersSnapshot.docs.map(async (userDoc) => {
        const unitIntakeRef = doc(firestore, `${userDoc.id}/Daily Totals/Unit Intake/${dateStr}`);
        const unitIntakeSnap = await getDoc(unitIntakeRef);

        // Use the 'value' field from the document for unit intake
        return {
          id: userDoc.id,
          unitIntakeToday: unitIntakeSnap.exists() ? unitIntakeSnap.data().value : 0,
        };
      }));

      // Sort usersData based on unitIntakeToday in descending order
      usersData.sort((a, b) => b.unitIntakeToday - a.unitIntakeToday);

      setRankings(usersData);
    };

    fetchRankings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Rankings - Units Consumed Today</Text>
      <FlatList
        data={rankings}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{`${item.id}: ${item.unitIntakeToday} units`}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default UnitsRankings;

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getFirestore, collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import moment from 'moment';

const SpentRankings = () => {
  const [rankings, setRankings] = useState([]);
  const firestore = getFirestore();
  const dateStr = moment().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchRankings = async () => {
      const usersRef = collection(firestore, "Users");
      const usersSnapshot = await getDocs(query(usersRef));
      
      // Fetch the amount spent for each user and include it in the rankings
      const usersData = await Promise.all(usersSnapshot.docs.map(async (userDoc) => {
        const amountSpentRef = doc(firestore, `${userDoc.id}/Daily Totals/Amount Spent/${dateStr}`);
        const amountSpentSnap = await getDoc(amountSpentRef);

        // Use the 'value' field from the document
        return {
          id: userDoc.id,
          amountSpentToday: amountSpentSnap.exists() ? amountSpentSnap.data().value : 0,
        };
      }));

      // Sort usersData based on amountSpentToday in descending order
      usersData.sort((a, b) => b.amountSpentToday - a.amountSpentToday);

      setRankings(usersData);
    };

    fetchRankings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Rankings - Amount Spent Today</Text>
      <FlatList
        data={rankings}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{`${item.id}: $${item.amountSpentToday.toFixed(2)}`}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default SpentRankings;

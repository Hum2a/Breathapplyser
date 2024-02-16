import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';

const OnlineRankings = () => {
  const [rankings, setRankings] = useState([]);
  const firestore = getFirestore();

  useEffect(() => {
    const fetchRankings = async () => {
      const rankingsRef = collection(firestore, "leaderboard");
      const q = query(rankingsRef, /* You can add ordering here */);
      
      try {
        const querySnapshot = await getDocs(q);
        const rankingsData = querySnapshot.docs.map(doc => doc.data());
        setRankings(rankingsData);
      } catch (error) {
        console.error('Error fetching rankings:', error);
      }
    };

    fetchRankings();
  }, []);

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Online Rankings</Text>
      <FlatList
        data={rankings}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
            <Text>{item.username}</Text>
            <Text>{`$${item.totalSpent.toFixed(2)}`}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default OnlineRankings;

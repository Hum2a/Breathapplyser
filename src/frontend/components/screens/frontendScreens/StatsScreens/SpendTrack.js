import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFirestore, doc, onSnapshot } from '@firebase/firestore'; // Import onSnapshot
import { UserContext } from '../../../../context/UserContext';
import moment from 'moment';

const SpendingTrack = () => {
  const { user } = useContext(UserContext);
  const firestore = getFirestore();
  const [amountSpent, setAmountSpent] = useState(0);
  const [spendingLimit, setSpendingLimit] = useState(0);

  useEffect(() => {
    const today = moment().format('YYYY-MM-DD');
    if (user) {
      const spentRef = doc(firestore, user.uid, 'Daily Totals', 'Amount Spent', today);
      const limitsRef = doc(firestore, user.uid, 'Limits');

      // Real-time listener for amount spent
      const unsubscribeSpent = onSnapshot(spentRef, (doc) => {
        if (doc.exists()) {
          setAmountSpent(doc.data().value);
        } else {
          setAmountSpent(0);
        }
      }, (error) => {
        console.error('Error fetching amount spent:', error);
      });

      // Real-time listener for spending limit
      const unsubscribeLimits = onSnapshot(limitsRef, (doc) => {
        if (doc.exists()) {
          setSpendingLimit(doc.data().spendingLimit);
        }
      }, (error) => {
        console.error('Error fetching spending limit:', error);
      });

      // Cleanup function to unsubscribe from the listeners when the component unmounts
      return () => {
        unsubscribeSpent();
        unsubscribeLimits();
      };
    }
  }, [user]);

  const calculateColor = () => {
    const ratio = Math.min(amountSpent / spendingLimit, 1); // Ensure the ratio does not exceed 1
    const red = Math.round(255 * ratio);
    const green = Math.round(255 * (1 - ratio));
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Amount Spent: </Text>
      <Text style={[styles.value, { color: calculateColor() }]}>£{amountSpent.toFixed(2)}</Text>
      <Text style={styles.separator}>|</Text>
      <Text style={styles.limits}> £{spendingLimit.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 3,
    color: '#7048B6',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 2,
  },
  separator: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  limits: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff0000',
  },
});

export default SpendingTrack;

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFirestore, doc, getDoc } from '@firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import moment from 'moment';

const SpendingTrack = () => {
  const { user } = useContext(UserContext);
  const firestore = getFirestore();
  const [amountSpent, setAmountSpent] = useState(0);
  const [spendingLimit, setSpendingLimit] = useState(0);

  useEffect(() => {
    const fetchAmountSpent = async () => {
      try {
        const today = moment().format('YYYY-MM-DD')
        const spentRef = doc(firestore, user.uid, 'Daily Totals', 'Amount Spent', today);
        const docSnap = await getDoc(spentRef);
        if (docSnap.exists()) {
          setAmountSpent(docSnap.data().value);
        } else {
          setAmountSpent(0);
        }
      } catch (error) {
        console.error('Error fetching amount spent:', error);
      }
    };

    const fetchSpendingLimit = async () => {
      try {
        const limitsRef = doc(firestore, user.uid, 'Limits');
        const docSnap = await getDoc(limitsRef);
        if (docSnap.exists()) {
          setSpendingLimit(docSnap.data().spendingLimit);
        }
      } catch (error) {
        console.error('Error fetching spending limit:', error);
      }
    };

    fetchAmountSpent();
    fetchSpendingLimit();
  }, [user]);

  // Calculate the color dynamically based on the ratio of amountSpent to spendingLimit
  const calculateColor = () => {
    const ratio = amountSpent / spendingLimit;
    const green = Math.round(255 * ratio); // Change the intensity of green based on the ratio
    const red = Math.round(255 * (1 - ratio)); // Change the intensity of red based on the ratio
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Amount Spent: </Text>
      <Text style={[styles.value, { color: calculateColor() }]}>£{amountSpent} </Text>
      <Text style={styles.separator}>|</Text>
      <Text style={styles.limits}> £{spendingLimit}</Text>
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
    marginRight: 5,
    color: '#7048B6',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  separator: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#000000', // You can adjust the separator color here
  },
  limits: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff0000', // You can adjust the color of limits here
  },
});

export default SpendingTrack;

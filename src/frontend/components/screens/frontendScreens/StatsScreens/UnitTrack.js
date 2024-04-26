import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFirestore, doc, onSnapshot } from '@firebase/firestore'; // Import onSnapshot
import { UserContext } from '../../../../context/UserContext';
import moment from 'moment';

const UnitTrack = () => {
  const { user } = useContext(UserContext);
  const firestore = getFirestore();
  const [unitIntake, setUnitIntake] = useState(0);
  const [limits, setLimits] = useState(0);

  useEffect(() => {
    const today = moment().format('YYYY-MM-DD');

    // Real-time listener for unit intake
    const intakeRef = doc(firestore, user.uid, 'Daily Totals', 'Unit Intake', today);
    const unsubscribeIntake = onSnapshot(intakeRef, (doc) => {
      if (doc.exists()) {
        setUnitIntake(doc.data().value);
      } else {
        setUnitIntake(0);
      }
    }, (error) => {
      console.error('Error fetching unit intake:', error);
    });

    // Real-time listener for limits
    const limitsRef = doc(firestore, user.uid, 'Limits');
    const unsubscribeLimits = onSnapshot(limitsRef, (doc) => {
      if (doc.exists()) {
        setLimits(doc.data().drinkingLimit);
      }
    }, (error) => {
      console.error('Error fetching limits:', error);
    });

    // Cleanup function to unsubscribe from the listeners when the component unmounts
    return () => {
      unsubscribeIntake();
      unsubscribeLimits();
    };
  }, [user]);

  // Calculate the color dynamically based on the ratio of unitIntake to limits
  const calculateColor = () => {
    if (limits === 0) {
      // When limits are zero, return a default color (e.g., gray to indicate no data or limit)
      return 'rgb(128, 128, 128)';
  }
    const ratio = unitIntake / limits;
    const green = Math.round(255 * (1 - ratio)); // Change the intensity of green based on the ratio
    const red = Math.round(255 * ratio); // Change the intensity of red based on the ratio
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Units Drank: </Text>
      <Text style={[styles.value, { color: calculateColor() }]}>{unitIntake}</Text>
      <Text style={styles.separator}>|</Text>
      <Text style={styles.limits}>{limits}</Text>
    </View>
  );
};

// Styles remain the same
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
    marginRight: 2,
    color: '#000000',
  },
  limits: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff0000',
    marginRight: 10,
  },
});

export default UnitTrack;

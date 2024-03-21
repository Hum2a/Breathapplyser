import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFirestore, doc, getDoc } from '@firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import moment from 'moment';

const UnitTrack = () => {
  const { user } = useContext(UserContext);
  const firestore = getFirestore();
  const [unitIntake, setUnitIntake] = useState(0);
  const [limits, setLimits] = useState(0);

  useEffect(() => {
    const fetchUnitIntake = async () => {
      try {
        const today = moment().format('YYYY-MM-DD')
        const intakeRef = doc(firestore, user.uid, 'Daily Totals', 'Unit Intake', today);
        const docSnap = await getDoc(intakeRef);
        if (docSnap.exists()) {
          setUnitIntake(docSnap.data().value);
        } else {
          setUnitIntake(0);
        }
      } catch (error) {
        console.error('Error fetching unit intake:', error);
      }
    };

    const fetchLimits = async () => {
      try {
        const limitsRef = doc(firestore, user.uid, 'Limits');
        const docSnap = await getDoc(limitsRef);
        if (docSnap.exists()) {
          setLimits(docSnap.data().drinkingLimit);
        }
      } catch (error) {
        console.error('Error fetching limits:', error);
      }
    };

    fetchUnitIntake();
    fetchLimits();
  }, [user]);

  // Calculate the color dynamically based on the ratio of unitIntake to limits
  const calculateColor = () => {
    const ratio = unitIntake / limits;
    const green = Math.round(255 * ratio); // Change the intensity of green based on the ratio
    const red = Math.round(255 * (1 - ratio)); // Change the intensity of red based on the ratio
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Units Drank: </Text>
      <Text style={[styles.value, { color: calculateColor() }]}>{unitIntake} </Text>
      <Text style={styles.separator}>|</Text>
      <Text style={styles.limits}> {limits}</Text>
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
    marginRight: 10,
  },
});

export default UnitTrack;

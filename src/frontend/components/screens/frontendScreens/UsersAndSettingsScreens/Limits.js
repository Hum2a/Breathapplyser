import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Button, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { limitStyles as styles } from '../../../styles/DrinkingStyles/limitStyles';
import { UserContext } from '../../../../context/UserContext';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../../../buttons/backButton';

const LimitsScreen = () => {
  const { user } = useContext(UserContext);
  const [spendingLimit, setSpendingLimit] = useState(0);
  const [drinkingLimit, setDrinkingLimit] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLimitType, setCurrentLimitType] = useState('spending');
  const [inputValue, setInputValue] = useState('');
  const [spendingLimitStrictness, setSpendingLimitStrictness] = useState('soft');
  const [drinkingLimitStrictness, setDrinkingLimitStrictness] = useState('soft');
  const firestore = getFirestore();

  useEffect(() => {
    loadLimits();
  }, [user]);

  const loadLimits = async () => {
    if (user) {
      const docRef = doc(firestore, user.uid, "Limits");
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const Limits = docSnap.data();
          setSpendingLimit(Limits.spendingLimit);
          setDrinkingLimit(Limits.drinkingLimit);
        }
      } catch (error) {
        console.error('Error loading Limits:', error);
      }
    }
  };

  const saveLimits = async () => {
    if (user) {
      const docRef = doc(firestore, user.uid, "Limits");
      try {
        await setDoc(docRef, {
          spendingLimit,
          drinkingLimit,
          spendingLimitStrictness, // Save the selected strictness
          drinkingLimitStrictness, // Save the selected strictness
        });
        console.log('Limits saved successfully');
      } catch (error) {
        console.error('Error saving Limits:', error);
      }
    }
  };

  const handleOpenModal = (type) => {
    setCurrentLimitType(type);
    setInputValue(type === 'spending' ? String(spendingLimit) : String(drinkingLimit));
    setModalVisible(true);
  };

  const handleConfirmLimit = () => {
    const limit = parseInt(inputValue, 10);
    if (!isNaN(limit)) {
      if (currentLimitType === 'spending') {
        setSpendingLimit(limit);
      } else {
        setDrinkingLimit(limit);
      }
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.fullScreen}>
      <BackButton/>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Enter limit"
              placeholderTextColor="#b3e5fc"
            />
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLimit}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        <Text style={styles.title}>Limits</Text>
        <View style={styles.limitContainer}>
          <TouchableOpacity onPress={() => handleOpenModal('spending')}>
            <View style={styles.limitInnerContainer}>
              <Text style={styles.label}>Spending Limit: £{spendingLimit}</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={500}
                step={1}
                value={spendingLimit}
                onValueChange={setSpendingLimit}
                minimumTrackTintColor="#03a9f4"
                thumbTintColor="#0288d1"
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
          <TouchableOpacity
            style={[styles.strictnessButton, { backgroundColor: spendingLimitStrictness === 'soft' ? '#0288d1' : '#BDBDBD' }]}
            onPress={() => setSpendingLimitStrictness('soft')}>
            <Text style={styles.strictnessButtonText}>Soft</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.strictnessButton, { backgroundColor: spendingLimitStrictness === 'hard' ? '#0288d1' : '#BDBDBD' }]}
            onPress={() => setSpendingLimitStrictness('hard')}>
            <Text style={styles.strictnessButtonText}>Hard</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.limitContainer}>
          <TouchableOpacity onPress={() => handleOpenModal('drinking')}>
            <View style={styles.limitInnerContainer}>
              <Text style={styles.label}>Drinking Limit: {drinkingLimit} units</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={drinkingLimit}
                onValueChange={setDrinkingLimit}
                minimumTrackTintColor="#03a9f4"
                thumbTintColor="#0288d1"
              />
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
            <TouchableOpacity
              style={[styles.strictnessButton, { backgroundColor: drinkingLimitStrictness === 'soft' ? '#0288d1' : '#BDBDBD' }]}
              onPress={() => setDrinkingLimitStrictness('soft')}>
              <Text style={styles.strictnessButtonText}>Soft</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.strictnessButton, { backgroundColor: drinkingLimitStrictness === 'hard' ? '#0288d1' : '#BDBDBD' }]}
              onPress={() => setDrinkingLimitStrictness('hard')}>
              <Text style={styles.strictnessButtonText}>Hard</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={saveLimits}>
          <Text style={styles.buttonText}>Save Limits</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LimitsScreen;

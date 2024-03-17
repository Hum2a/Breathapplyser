import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { profStyles } from '../../../styles/SettingStyles/profileStyles';
import { getFirestore, doc, setDoc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import { UserContext } from '../../../../context/UserContext';

const BodyStats = ({ route, navigation }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm'); // Default unit for height
  const [weightUnit, setWeightUnit] = useState('kg'); // Default unit for weight
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('male');
  const [bmi, setBMI] = useState('');
  const firestore = getFirestore();
  const { user } = useContext(UserContext);

  const calculateBMI = () => {
    // Convert height and weight to a common unit (e.g., cm and kg)
    const heightInCM = heightUnit === 'ft' ? height * 30.48 : height;
    const weightInKG = weightUnit === 'lbs' ? weight / 2.20462 : weight;

    // Calculate BMI using height in cm and weight in kg
    const heightInMeters = heightInCM / 100;
    const bmiValue = weightInKG / (heightInMeters * heightInMeters);
    setBMI(bmiValue.toFixed(2));
  };

  const handleSaveProfile = async () => {
    const profileDoc = {
      height,
      weight,
      age,
      sex,
      bmi,
      dateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    const userUID = user.uid; // Get UID from navigation params
    const docRef = doc(firestore, userUID, "Profile");

    updateDoc(docRef, profileDoc)
    .then(() => {
      console.log('Profile updated successfully');
      navigateToLimits(); // Navigate to the home screen upon success
    })
    .catch(error => {
      console.error('Error updating profile:', error);
    });
  };

  const handleClearProfile = () => {
    setHeight('');
    setWeight('');
    // setHeightUnit('cm'); // Reset height unit to default
    // setWeightUnit('kg'); // Reset weight unit to default
    setAge('');
    setSex('');
    setBMI('');
  };

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  const navigateToLimits = () => {
    navigation.navigate('BodyLimits');
  }

  return (
    <View style={profStyles.container}>
      {/* Inputs for height, weight, age, and sex */}
      <View style={profStyles.unitPickerContainer}>
        <TextInput
          style={profStyles.input}
          placeholder={`Height (${heightUnit})`}
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />
        <Picker
          style={profStyles.unitPicker}
          selectedValue={heightUnit}
          onValueChange={setHeightUnit}
        >
          <Picker.Item label="cm" value="cm" />
          <Picker.Item label="ft" value="ft" />
        </Picker>
      </View>
      <View style={profStyles.unitPickerContainer}>
        <TextInput
          style={profStyles.input}
          placeholder={`Weight (${weightUnit})`}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
        <Picker
          style={profStyles.unitPicker}
          selectedValue={weightUnit}
          onValueChange={setWeightUnit}
        >
          <Picker.Item label="kg" value="kg" />
          <Picker.Item label="lbs" value="lbs" />
        </Picker>
      </View>
      <TextInput
        style={profStyles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <Picker
        style={profStyles.unitPicker}
        selectedValue={sex}
        onValueChange={setSex}
      >
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
      </Picker>
      
      <Text style={profStyles.text}>BMI: {bmi}</Text>
      {/* Action Buttons */}
      <TouchableOpacity style={profStyles.button} onPress={calculateBMI}>
        <Text style={profStyles.buttonText}>Calculate BMI</Text>
      </TouchableOpacity>
      <TouchableOpacity style={profStyles.button} onPress={handleSaveProfile}>
        <Text style={profStyles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={profStyles.clearButton} onPress={handleClearProfile}>
        <Text style={profStyles.clearButtonText}>Clear Information</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={profStyles.clearButton} onPress={navigateToHome}>
        <Text style={profStyles.clearButtonText}>Home Screen</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default BodyStats;

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
  const [heightUnit, setHeightUnit] = useState('cm');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('male');
  const [bmi, setBMI] = useState('');
  const firestore = getFirestore();
  const { user } = useContext(UserContext);

  const calculateBMI = () => {
    // Convert height and weight to a common unit (e.g., cm and kg)
    let heightInCM;
    if (heightUnit === 'ft') {
      // Convert feet and inches to centimeters
      const totalInches = parseInt(feet) * 12 + parseInt(inches);
      heightInCM = totalInches * 2.54;
    } else {
      heightInCM = parseFloat(height);
    }
    const weightInKG = weightUnit === 'lbs' ? parseFloat(weight) / 2.20462 : parseFloat(weight);
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

  const navigateToLimits = () => {
    navigation.navigate('BodyLimits');
  }

  return (
    <View style={profStyles.container}>

      <Text style={profStyles.inputLabel}>Height</Text>

      <View style={profStyles.unitPickerContainer}>
        {heightUnit === 'cm' ? (
          <TextInput
            style={profStyles.input}
            placeholder="Height (cm)"
            placeholderTextColor={'black'}
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
        ) : (
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <TextInput
              style={[profStyles.input, { flex: 0.5, marginRight: 4 }]}
              placeholder="Feet"
              placeholderTextColor={'black'}
              value={feet}
              onChangeText={setFeet}
              keyboardType="numeric"
            />
            <TextInput
              style={[profStyles.input, { flex: 0.5 }]}
              placeholder="Inches"
              placeholderTextColor={'black'}
              value={inches}
              onChangeText={setInches}
              keyboardType="numeric"
            />
          </View>
        )}
        <Picker
          style={profStyles.unitPicker}
          selectedValue={heightUnit}
          onValueChange={(itemValue) => {
            setHeightUnit(itemValue);
            if (itemValue === 'cm') {
              // Convert feet and inches to cm when switching back to cm
              const totalInches = parseInt(feet) * 12 + parseInt(inches);
              setHeight((totalInches * 2.54).toFixed(0));
            } else {
              // Reset feet and inches when switching to feet
              const cmInFeet = Math.floor(height / 30.48);
              const cmInInches = ((height / 30.48) - cmInFeet) * 12;
              setFeet(cmInFeet.toString());
              setInches(cmInInches.toFixed(0));
            }
          }}
          mode="dropdown"
        >
          <Picker.Item label="cm" value="cm" />
          <Picker.Item label="ft" value="ft" />
        </Picker>
      </View>

      <Text style={profStyles.inputLabel}>Weight</Text>
      
      <View style={profStyles.unitPickerContainer}>
        <TextInput
          style={profStyles.input}
          placeholder={`Weight (${weightUnit})`}
          placeholderTextColor={'black'}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
        <Picker
          style={profStyles.unitPicker}
          selectedValue={weightUnit}
          onValueChange={setWeightUnit}
          mode='dropdown'
        >
          <Picker.Item label="kg" value="kg" />
          <Picker.Item label="lbs" value="lbs" />
        </Picker>
      </View>

      <Text style={profStyles.inputLabel}>Age</Text>
      <View style={profStyles.unitPickerContainer}>
        <TextInput
          style={profStyles.input}
          placeholder="Age"
          placeholderTextColor={'black'}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
      </View>

      <Text style={profStyles.inputLabel}>Sex</Text>
        <View style={profStyles.unitPickerContainer}>
          <Picker
            style={profStyles.sexUnitPicker}
            selectedValue={sex}
            onValueChange={setSex}
            mode="dropdown"
          >
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
        </View>
      
      <Text style={profStyles.bmiLabel}>BMI: {bmi}</Text>
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

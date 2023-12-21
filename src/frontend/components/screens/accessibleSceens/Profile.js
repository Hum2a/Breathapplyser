import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import { profStyles } from '../../styles/styles';
import { saveDataToFile, globalData } from '../../../utils/database';
import { UserContext } from '../../../context/UserContext';
import { getServerBaseUrl } from '../../../utils/config/dbURL';

const ProfileScreen = () => {
  const [height, setHeight] = useState('186');
  const [weight, setWeight] = useState('62');
  const [age, setAge] = useState('22');
  const [sex, setSex] = useState('male');
  const [bmi, setBMI] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [ageUnit, setAgeUnit] = useState('years');
  const { user } = useContext(UserContext);

  const calculateBMI = () => {
    // Perform BMI calculation based on height and weight and update the bmi state variable
    let heightInMeters = height / 100; // Default height in meters
    
    if (heightUnit === 'ft') {
      // Convert height from feet to centimeters
      heightInMeters = convertHeight(height, 'ft') / 100;
    }
    
    let weightInKg = weight; // Default weight in kilograms
    
    if (weightUnit === 'lbs') {
      // Convert weight from pounds to kilograms
      weightInKg = convertWeight(weight, 'lbs');
    }
    
    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    setBMI(bmiValue.toFixed(2)); // Round BMI value to 2 decimal places
  };

  const handleSaveProfile = async () => {
    const profile = {
      user_id: user.id, // Assuming user has an id
      height: height,
      weight: weight,
      age: age,
      sex: sex,
      bmi: bmi,
      dateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    try {
      const response = await fetch(`${getServerBaseUrl()}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const responseData = await response.json();
      console.log('ProfileScreen.js: Profile saved:', responseData);
    } catch (error) {
      console.error('ProfileScreen.js: Error saving profile:', error);
    }
  };
  
  // const handleSaveProfile = () => {
  //   const profile = {
  //     height: height !== '' ? height : globalData.profile?.height,
  //     weight: weight !== '' ? weight : globalData.profile?.weight,
  //     age: age !== '' ? age : globalData.profile?.age,
  //     sex: sex !== '' ? sex : globalData.profile?.sex,
  //     bmi: bmi !== '' ? bmi : globalData.profile?.bmi,
  //     dateTime: moment().format('YYYY-MM-DD HH:mm:ss'), // Add the current date and time
  //   };
  
  //   globalData.profile = {
  //     ...globalData.profile,
  //     ...profile,
  //   };
  
  //   saveDataToFile()
  //     .then(() => {
  //       console.log('Profile details saved:', profile);
  //     })
  //     .catch((error) => {
  //       console.log('Error saving profile details:', error);
  //     });
  // };
  

  const handleClearProfile = () => {
    setHeight('');
    setWeight('');
    setAge('');
    setSex('');
    setBMI('');
  };

  const convertHeight = (height, unit) => {
    if (unit === 'cm') {
      // Convert height to cm (assuming the height is in feet)
      return (height * 0.0328084).toFixed(2);
    } else if (unit === 'feet') {
      // Convert height to feet (assuming the height is in cm)
      return (height * 30.48).toFixed(2);
    }
    // Return the height as is if the unit is not recognized
    return height;
  };

  const convertWeight = (weight, unit) => {
    if (unit === 'kg') {
      // Convert weight to kilograms (assuming the weight is in pounds)
      return (weight * 2.20462).toFixed(2);
    } else if (unit === 'lbs') {
      // Convert weight to pounds (assuming the weight is in kilograms)
      return (weight * 0.453592).toFixed(2);
    }
    // Return the weight as is if the unit is not recognized
    return weight;
  };

  return (
    <View style={profStyles.container}>
      <View style={profStyles.banner}>
      <View style={profStyles.banner}>
        <Text style={profStyles.bannerText}>
          Age: {globalData.profile?.age} years | Weight: {globalData.profile?.weight} {weightUnit} ({convertWeight(globalData.profile?.weight, weightUnit)} {weightUnit === 'kg' ? 'lbs' : 'kg'}) | Height: {globalData.profile?.height} {heightUnit} ({convertHeight(globalData.profile?.height, heightUnit)} {heightUnit === 'cm' ? 'feet' : 'cm'}) | Sex: {globalData.profile?.sex}
        </Text>
      </View>
      </View>
      <Text style={profStyles.title}>Profile</Text>
      <View style={profStyles.inputContainer}>
        <TextInput
          style={profStyles.input}
          placeholder="Height"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />
        <Picker
          style={profStyles.unitPicker}
          selectedValue={heightUnit}
          onValueChange={(itemValue) => setHeightUnit(itemValue)}
        >
          <Picker.Item label="cm" value="cm" />
          <Picker.Item label="feet" value="feet" />
        </Picker>
      </View>
      <View style={profStyles.inputContainer}>
        <TextInput
          style={profStyles.input}
          placeholder="Weight"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
        <Picker
          style={profStyles.unitPicker}
          selectedValue={weightUnit}
          onValueChange={(itemValue) => setWeightUnit(itemValue)}
        >
          <Picker.Item label="kg" value="kg" />
          <Picker.Item label="lbs" value="lbs" />
        </Picker>
      </View>
      <View style={profStyles.inputContainer}>
        <TextInput
          style={profStyles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <Picker
          style={profStyles.unitPicker}
          placeholder="units"
          selectedValue={ageUnit}
          onValueChange={(itemValue) => setAgeUnit(itemValue)}
        >
          <Picker.Item label="Years" value="years" />
        </Picker>
      </View>
      <Picker
          style={profStyles.unitPicker}
          placeholder="Sex"
          selectedValue={sex}
          onValueChange={(itemValue) => setSex(itemValue)}
        >
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      <Text style={profStyles.text}>BMI: {bmi}</Text>
      <TouchableOpacity style={profStyles.button} onPress={calculateBMI}>
        <Text style={profStyles.buttonText}>Calculate BMI</Text>
      </TouchableOpacity>
      <TouchableOpacity style={profStyles.button} onPress={handleSaveProfile}>
        <Text style={profStyles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={profStyles.clearButton} onPress={handleClearProfile}>
        <Text style={profStyles.clearButtonText}>Clear Information</Text>
      </TouchableOpacity>
    </View>
  );
}
export default ProfileScreen;

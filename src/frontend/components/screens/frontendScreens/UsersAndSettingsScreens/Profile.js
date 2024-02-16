import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import { profStyles } from '../../../styles/SettingStyles/profileStyles';
import { UserContext } from '../../../../context/UserContext';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
// import { firestore } from '../../../../backendFB/database/firebase';

const ProfileScreen = () => {
  const [height, setHeight] = useState('186');
  const [weight, setWeight] = useState('62');
  const [age, setAge] = useState('23');
  const [sex, setSex] = useState('male');
  const [bmi, setBMI] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [ageUnit, setAgeUnit] = useState('years');
  const [heightFeet, setHeightFeet] = useState('6');
  const [heightInches, setHeightInches] = useState('1');
  const { user } = useContext(UserContext);
  const firestore = getFirestore();

  useEffect(() => {
    const fetchProfile = async () => {
      console.log('Profile.js: fetchProfile called')
      if (user) {
        console.log('Profile.js: User Found');
        const docRef = doc(firestore, user.uid, "profiles");
        console.log('Profile.js: docRef created')
        const docSnap = await getDoc(docRef);
        console.log('Profile.js: docSnap requested')
        if (docSnap.exists()) {
          console.log('Profile.js: docSnap found')
          const userProfile = docSnap.data();
          setHeight(userProfile.height);
          setWeight(userProfile.weight);
          setAge(userProfile.age);
          setSex(userProfile.sex);
          setBMI(userProfile.bmi);
          // console.log('Profile.js: Attributes set: Height: ', {userProfile.height}, ' Weight: ', {userProfile.weight}, ' Age: ', {userProfile.age}, ' Sex: ', {userProfile.sex}, 'BMI: ', {userProfile.bmi})
        } else {
          console.log("No such document!");
        }
      }
    };
  
    fetchProfile();
  }, []); // The empty array ensures this effect runs only once after the component mounts
  
  
  const handleSaveProfile = async () => {
    const profileDoc = {
      height,
      weight,
      age,
      sex,
      bmi,
      dateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    if (user) {
      await setDoc(doc(firestore, user.uid, "Profile"), profileDoc)
        .then(() => console.log('Profile saved successfully'))
        .catch(error => console.error('Error saving profile:', error));
    }
  };


  const calculateBMI = () => {
    // Perform BMI calculation based on height and weight and update the bmi state variable
    let heightInMeters; // Default height in meters
    
    if (heightUnit === 'ft') {
      // Convert height from feet and inches to meters
      const totalInches = parseInt(heightFeet) * 12 + parseInt(heightInches);
      heightInMeters = totalInches * 0.0254;
    } else {
      heightInMeters = height / 100; // Height in meters if cm is selected
    }
    
    let weightInKg = weight; // Default weight in kilograms
    
    if (weightUnit === 'lbs') {
      // Convert weight from pounds to kilograms
      weightInKg = convertWeight(weight, 'lbs');
    }
    
    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    setBMI(bmiValue.toFixed(2)); // Round BMI value to 2 decimal places
  };

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
      <Text style={profStyles.title}>Your Profile</Text>

      <View style={profStyles.inputContainer}>
        <Text style={profStyles.inputLabel}>Height</Text>
        {heightUnit === 'cm' ? (
          <TextInput
            style={profStyles.input}
            placeholder="Height in cm"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
        ) : (
          <View style={profStyles.inputDualContainer}>
            <TextInput
              style={[profStyles.input, profStyles.inputDual]}
              placeholder="Feet"
              value={heightFeet}
              onChangeText={setHeightFeet}
              keyboardType="numeric"
            />
            <TextInput
              style={[profStyles.input, profStyles.inputDual]}
              placeholder="Inches"
              value={heightInches}
              onChangeText={setHeightInches}
              keyboardType="numeric"
            />
          </View>
        )}
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
        <Text style={profStyles.inputLabel}>Weight</Text>
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
        <Text style={profStyles.inputLabel}>Age</Text>
        <TextInput
          style={profStyles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
      </View>

      <View style={profStyles.inputContainer}>
        <Text style={profStyles.inputLabel}>Sex</Text>
        <Picker
          style={profStyles.unitPicker}
          selectedValue={sex}
          onValueChange={(itemValue) => setSex(itemValue)}
        >
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>

      <Text style={profStyles.bmiLabel}>Your BMI: {bmi}</Text>

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

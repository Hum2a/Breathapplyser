import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { RegisterStyles } from '../../../styles/StartUpStyles/registerStyles';
import { registerUser } from '../../../../../backend/firebase/database/firebase';
import { getFirestore } from '@firebase/firestore';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient


const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const firestore = getFirestore();


  const handleRegister = () => {
    registerUser(
      username, 
      email, 
      password, 
      confirmPassword,
      dateOfBirth,
      (uid) => {
        console.log('Registration successful with UID:', uid);
        navigation.navigate('BodyStats', { userUID: uid });
      },
      (error) => {
        console.error('Error during registration:', error.message);
      }
    );
  };
  

  // New function to handle date change
  const handleDateChange = (event, selectedDate) => {
    setDatePickerVisible(false); // Hide the date picker
    const currentDate = selectedDate || dateOfBirth;
    setDateOfBirth(currentDate);
  };

  const navigateToBodyStats = () => {
    navigation.navigate('BodyStats');
  };
  console.log("Date of Birth:", dateOfBirth); // Debugging log

  return (
    <View style={RegisterStyles.container}>
      <TextInput
        style={RegisterStyles.input}
        placeholder="Username"
        placeholderTextColor={'black'}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={RegisterStyles.input}
        placeholder="Email"
        placeholderTextColor={'black'}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={RegisterStyles.input}
        placeholder="Password"
        placeholderTextColor={'black'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={RegisterStyles.input}
        placeholder="Confirm Password"
        placeholderTextColor={'black'}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={RegisterStyles.datePickerButton}>
        <Text style={RegisterStyles.datePickerButtonText}>Select your Date of Birth</Text>
      </TouchableOpacity>
      <Text style={RegisterStyles.dateOfBirthText}>Date of Birth: {moment(dateOfBirth).format('YYYY-MM-DD')}</Text>

      {isDatePickerVisible && (
        <DateTimePicker
          value={dateOfBirth}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()} // Disallow future dates
        />
      )}

      {/* Gradient Button for Register */}
      <TouchableOpacity onPress={handleRegister} style={RegisterStyles.gradientButton}>
        <LinearGradient
          colors={['#6dd5ed', '#2193b0']} // Gradient colors
          style={RegisterStyles.gradientButtonGradient}>
          <Text style={RegisterStyles.gradientButtonText}>Register</Text>
        </LinearGradient>
      </TouchableOpacity>

    </View>
  );
};

export default RegisterScreen;

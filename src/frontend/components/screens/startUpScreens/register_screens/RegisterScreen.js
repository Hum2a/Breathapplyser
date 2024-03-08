import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { RegisterStyles } from '../../../styles/StartUpStyles/registerStyles';
import { registerUser } from '../../../../../backend/firebase/database/firebase';
import { getFirestore } from '@firebase/firestore';


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
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={RegisterStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={RegisterStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={RegisterStyles.input}
        placeholder="Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={RegisterStyles.datePickerButton} 
        onPress={() => setDatePickerVisible(true)}
      >
        <Text style={RegisterStyles.datePickerButtonText}>
          Select your Date of Birth
        </Text>
      </TouchableOpacity>
      <Text>Date of Birth: {moment(dateOfBirth).format('YYYY-MM-DD')}</Text>


      {isDatePickerVisible && (
        <DateTimePicker
          value={dateOfBirth}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()} // Optional: Disallow future dates
        />
      )}

      <TouchableOpacity onPress={handleRegister}>
        <Text>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToBodyStats}>
        <Text>BodyStats</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

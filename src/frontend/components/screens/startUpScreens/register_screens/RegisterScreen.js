import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { RegisterStyles } from '../../../styles/StartUpStyles/registerStyles';
import { registerUser } from '../../../../../backend/firebase/database/firebase';
import { getFirestore } from '@firebase/firestore';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient


const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('Tester');
  const [email, setEmail] = useState('testytest@test.com');
  const [password, setPassword] = useState('Testing');
  const [confirmPassword, setConfirmPassword] = useState('Testing');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const firestore = getFirestore();


  const handleRegister = () => {
    // Check if any of the fields are empty
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        Alert.alert("Missing Information", "Please fill in all fields.");
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        Alert.alert("Password Mismatch", "The passwords do not match.");
        return;
    }

    // Calculate age to ensure the user is at least 18 years old
    const currentDate = new Date();
    const eighteenthBirthday = new Date(dateOfBirth.getTime());
    eighteenthBirthday.setFullYear(eighteenthBirthday.getFullYear() + 18);

    if (currentDate < eighteenthBirthday) {
        Alert.alert("Age Restriction", "You must be at least 18 years old to register.");
        return;
    }

    // Proceed with registering the user
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
            Alert.alert("Registration Failed", error.message);
        }
    );
};



  // New function to handle date change
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth; // Keep the existing date if no new date is picked
    setDateOfBirth(currentDate);
    setDatePickerVisible(false); // Hide the date picker after selection or cancellation
};

  const navigateToBodyStats = () => {
    navigation.navigate('BodyStats');
  };
  console.log("Date of Birth:", dateOfBirth); // Debugging log

  return (
    <View style={RegisterStyles.container}>
      <View style={RegisterStyles.inputContainer}>
        <TextInput
          style={RegisterStyles.input}
          placeholder="Username"
          placeholderTextColor={'black'}
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={RegisterStyles.inputContainer}>
        <TextInput
          style={RegisterStyles.input}
          placeholder="Email"
          placeholderTextColor={'black'}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={RegisterStyles.inputContainer}>
        <TextInput
          style={RegisterStyles.input}
          placeholder="Password"
          placeholderTextColor={'black'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={RegisterStyles.toggleButton}>
          <Text>{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      <View style={RegisterStyles.inputContainer}>
        <TextInput
          style={RegisterStyles.input}
          placeholder="Confirm Password"
          placeholderTextColor={'black'}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={RegisterStyles.toggleButton}>
          <Text>{showConfirmPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={RegisterStyles.datePickerButton}>
        <Text style={RegisterStyles.datePickerButtonText}>
          Date of Birth: {moment(dateOfBirth).format('YYYY-MM-DD')}
        </Text>
      </TouchableOpacity>
      {isDatePickerVisible && (
        <DateTimePicker
          value={dateOfBirth}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
      <TouchableOpacity onPress={handleRegister} style={RegisterStyles.gradientButton}>
        <LinearGradient
          colors={['#6dd5ed', '#2193b0']}
          style={RegisterStyles.gradientButtonGradient}>
          <Text style={RegisterStyles.gradientButtonText}>Register</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

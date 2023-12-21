import AsyncStorage from '@react-native-async-storage/async-storage';

// Example function after successful login
const onLoginSuccess = async (userData) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    // Navigate to home screen or perform other actions
  } catch (error) {
    // Handle errors
  }
};

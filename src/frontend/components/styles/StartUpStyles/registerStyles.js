import { StyleSheet } from "react-native";

export const RegisterStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD', // Light blue background
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#B3E5FC', // Light blue border
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF', // White input background
  },
  datePickerButton: {
    width: '80%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#29B6F6', // Similar to gradient start
  },
  datePickerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateOfBirthText: {
    marginVertical: 10,
    fontSize: 16,
    color: '#0277BD', // Dark blue for contrast
  },
  // Style for the touchable area of the button
    gradientButton: {
      width: '80%',
      borderRadius: 10,
      marginVertical: 8,
      overflow: 'hidden', // Important for borderRadius to apply on gradient
    },
    // Style for the LinearGradient component
    gradientButtonGradient: {
      padding: 15,
      alignItems: 'center',
      borderRadius: 10,
    },
    // Style for the text inside the button
    gradientButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
});

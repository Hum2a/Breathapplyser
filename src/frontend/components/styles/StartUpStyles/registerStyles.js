import { StyleSheet } from "react-native";

export const RegisterStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00797B',
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
    flex: 1, 
    height: 50,
    padding: 10,
    color: 'navy',
  },
  datePickerButton: {
    width: '80%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#F24242', // Similar to gradient start
  },
  datePickerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateOfBirthText: {
    marginVertical: 10,
    fontSize: 16,
    color: 'white', // Dark blue for contrast
    backgroundColor: '#F24242',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    textAlign: 'center',
    fontWeight: 'bold',
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
    toggleButton: {
      marginTop: 10,
      marginBottom: 10,
      backgroundColor: '#f0f0f0',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center', // Centers the text horizontally
      justifyContent: 'center', // Centers the text vertically
      borderWidth: 1,
      borderColor: '#ccc', // A subtle border color that fits the light theme
      width: '50%', // Specifies the width of the button to be half of its container width
      alignSelf: 'center', // Centers the button within its container
  },
  
  // Also consider adding active touch feedback for better user experience:
    toggleButtonActive: {
      backgroundColor: '#e0e0e0', // Slightly darker for the pressed state
  },

    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center', 
      width: '80%',
      marginBottom: 10, 
    },
    
    input: {
      flex: 1, 
      height: 50,
      borderWidth: 1,
      borderColor: '#B3E5FC',
      padding: 10,
      borderRadius: 10,
      color: 'navy',
      backgroundColor: '#FFFFFF',
    },
    
    toggleButton: {
      padding: 10,
      marginHorizontal: 5,
    },
    activityIndicator: {
      marginVertical: 20,
    },
    
});

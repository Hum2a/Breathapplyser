import { StyleSheet } from "react-native";

export const amountSpentStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#F0F8FF', // Light blue background
    },
    graphTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#003366', // Dark blue for contrast and readability
      marginBottom: 20,
    },
    pickerStyle: {
      width: '80%',
      height: 40,
      marginBottom: 20,
      backgroundColor: 'rgba(242,66,66,0.4)',
      borderRadius: 20, // Rounded border
      borderWidth: 1,
      borderColor: '#007AFF', // Theme consistent blue for the border
      paddingHorizontal: 10, // Add padding for a softer look
  },
    refreshButton: {
      padding: 10,
      margin: 10,
      backgroundColor: 'transparent',
      alignItems: 'center',
    },
    updateButtonImage: {
      width: 30,
      height: 30,
    },
  });